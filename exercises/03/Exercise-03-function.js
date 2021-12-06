const aws = require("aws-sdk");
const s3 = new aws.S3();
const { parse } = require("csv-parse");

const { BUCKET_NAME, FILE_NAME } = process.env

exports.handler = async function (event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  try {
    const file = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_NAME }).promise();
	let objectData = file.Body.toString('utf-8');
	console.log(objectData);
  } catch (err) {
    console.log(err);
  }
};