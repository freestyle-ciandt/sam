const {parse} = require('csv-parse/dist/cjs/sync.cjs');
const { DynamoDB, S3 } = require("aws-sdk");

const { TABLE_NAME, BUCKET_NAME } = process.env;
const docClient = new DynamoDB.DocumentClient({ region: "us-east-1" });

const s3 = new S3();

const params = {
  Bucket: BUCKET_NAME,
  Key: "produtos.csv",
};

const getCSV = async () => {
  const produtos = await s3.getObject(params).promise();
  return produtos.Body.toString('utf-8');
};
const parseCsv = (csv) => {
  return parse(csv, {
    columns: true,
    skip_empty_lines: true
  })
};

const mountDynamoDBRequest = (produtos) => {
  const putRequests = produtos.map((produto) => ({ PutRequest: { Item: { ...produto } } }));
  const dynamoRequest = { RequestItems: {} };
  dynamoRequest.RequestItems[TABLE_NAME] = putRequests;
  return dynamoRequest
}

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
