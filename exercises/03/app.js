const { DynamoDB, S3 } = require("aws-sdk");
import { S3 } from "aws-sdk";
import { parse } from "csv-parse/sync";

const { TABLE_NAME, BUCKET_NAME } = process.env;
const docClient = new DynamoDB.DocumentClient({ region: "us-east-1" });

const s3 = new S3();

const params = {
  Bucket: BUCKET_NAME,
  Key: "produtos.csv",
};

const getCSV = async () => {
  const produtos = await s3.getObject(params).promise();
  return produtos;
};
const parser = (csv) => {
  return parse(csv, {
    columns: true,
    skip_empty_lines: true
  })
};

exports.lambdaHandler = async () => {
  parse()
  
  try {
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "This is the solution for exercise 01",
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
