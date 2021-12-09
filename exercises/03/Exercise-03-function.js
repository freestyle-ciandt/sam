const aws = require("aws-sdk");
const { S3, DynamoDB } = require('aws-sdk');
const s3 = new aws.S3();
const docClient = new aws.DynamoDB.DocumentClient({region: 'us-east-1'});
const csv = require("csvtojson");

const { BUCKET_NAME, FILE_NAME, PRODUTOS_TABLE_NAME } = process.env;

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

    const batches = [];
    const currentBatch = [];
    for(const item_id in jsonArray){
      currentBatch.push({
        PutRequest: {
            Item: jsonArray[item_id]
        }
      });
      if((parseInt(item_id)+1) % 25 == 0){
        batches.push(currentBatch);
        currentBatch.length = 0; // limpando o array
      }
    }

    for(const batch_id in batches){
      const params = {
        RequestItems: {
          PRODUTOS_TABLE_NAME: batches[batch_id]
         }
      };
      // TODO (Unprocessed items): caso algum item falhe, você deverá tentar escrevê-lo novamente.
      // TODO (Unprocessed items): caso algum item falhe, você deverá tentar escrevê-lo novamente.
      // TODO (Unprocessed items): caso algum item falhe, você deverá tentar escrevê-lo novamente.
      await docClient.batchWriteItem(params).promise();
    }

    
  } catch (err) {
    console.log(err);
  }
};
