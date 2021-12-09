const aws = require("aws-sdk");
const s3 = new aws.S3();
const csv = require("csvtojson");

const { BUCKET_NAME, FILE_NAME } = process.env;

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
  } catch (err) {
    console.log(err);
  }
};
