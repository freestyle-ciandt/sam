const { S3 } = require("aws-sdk");
const { parse } = require("csv-parse/dist/cjs/sync.cjs");
const R = require("ramda");

const s3 = new S3();

const params = {
  Bucket: "henrique-romulo",
  Key: "produtos.csv",
};

const getCSV = async () => {
  const produtos = await s3.getObject(params).promise();
  return produtos.Body.toString("utf-8");
};
const parseCsv = (csv) => {
  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
};

const mountDynamoDBRequest = (produtos) => {
  const putRequests = produtos.map((produto) => ({ PutRequest: { Item: { ...produto } } }));
  const dynamoRequest = { RequestItems: {} };
  dynamoRequest.RequestItems["Exercise03Table"] = putRequests;
  return dynamoRequest
};

const execute = async () => {
  const produtoResponse = await getCSV();
  const S3Response = parseCsv(produtoResponse);
  const dynamoRequestItem = mountDynamoDBRequest(s3Response);

  console.log(dynamoRequestItem)
};

execute();