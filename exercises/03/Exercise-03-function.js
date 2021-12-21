const aws = require("aws-sdk");
const { S3, DynamoDB, Inspector } = require("aws-sdk");
const s3 = new aws.S3();
const docClient = new aws.DynamoDB.DocumentClient({ region: "us-east-1" });
const csv = require("csvtojson");

const { BUCKET_NAME, FILE_NAME, PRODUTOS_TABLE_NAME } = process.env;

const BATCH_SIZE = 25;
const MAX_RETRIES = 3;

const batchWrite = async (items, retries = 0) => {
  if (retries >= MAX_RETRIES) return;
  const batches = [];
  const currentBatch = [];
  for (const item_id in items) {
    currentBatch.push({
      PutRequest: {
        Item: items[item_id],
      },
    });
    if ((parseInt(item_id) + 1) % BATCH_SIZE == 0) {
      batches.push(currentBatch);
      currentBatch.length = 0; // limpando o array
    }
  }

  for (const batch_id in batches) {
    const params = {
      RequestItems: {
        [PRODUTOS_TABLE_NAME]: batches[batch_id],
      },
    };

    console.log(`Calling batchWrite for batch ${batch_id}`);
    const { UnprocessedItems } = await docClient.batchWrite(params).promise();
    console.log({UnprocessedItems});
    if (UnprocessedItems && UnprocessedItems.length > 0) {
      ++retries;
      console.log(`Retrying to insert unprocessed items (retry ${retries})`)
      batchWrite(UnprocessedItems, retries);
    }
  }
};

exports.handler = async function (event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  try {
    const file = await s3
      .getObject({ Bucket: BUCKET_NAME, Key: FILE_NAME })
      .promise();
    const objectData = file.Body.toString("utf-8");
    console.log(objectData);

    const jsonArray = await csv().fromString(objectData);
    console.log(jsonArray);

    // jsonArray.map((e) => {
    //   e["id"] = parseInt(e["id"]);
    // });

    await batchWrite(jsonArray);
  } catch (err) {
    console.log(err);
  }
};
