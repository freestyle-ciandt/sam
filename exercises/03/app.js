const { DynamoDB, S3 } = require("aws-sdk");
// const { parse } = require('csv-parse/dist/cjs/sync.cjs');
const { parse } = require("csv-parse/sync");

const { TABLE_NAME, BUCKET_NAME } = process.env;
const docClient = new DynamoDB.DocumentClient({ region: "us-east-1" });

const s3 = new S3();

const params = {
  Bucket: BUCKET_NAME,
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
  dynamoRequest.RequestItems[TABLE_NAME] = putRequests;
  return dynamoRequest
};
const writeToDatabase = async (value) => {
  let retryCount = 0
  const res = await docClient.batchWrite(value).promise();

	if(res.UnprocessedItems && res.UnprocessedItems.length > 0) {
		if (retryCount > 2) {
			throw new Error(res.UnprocessedItems);
		}
		return batchWrite(res.UnprocessedItems, retryCount + 1);
	}
}

exports.lambdaHandler = async () => {
  const produtoResponse = await getCSV();
  console.log('produtoResponse:', produtoResponse);
  const S3Response = parseCsv(produtoResponse);
  console.log('S3Response', S3Response);
  while(S3Response.length) {
    const dynamoRequestItem = mountDynamoDBRequest(S3Response.splice(0,25));
    console.log('dynamoRequestItem', dynamoRequestItem);
    await writeToDatabase(dynamoRequestItem);
  }
};