const parse = require('csv-parse/lib/sync');
const { S3, DynamoDB } = require('aws-sdk');

const { BUCKET_PRODUTOS, TABLE_NAME, AWS_REGION } = process.env;
const s3 = new S3();
const documentClient = new DynamoDB.DocumentClient({ region: AWS_REGION })

const MAX_TRIES = 5

const delay = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))

const getCsv = async () => {
  const produtosCsv = await s3.getObject({
    Bucket: BUCKET_PRODUTOS,
    Key: "produtos.csv"
  }).promise();

  return produtosCsv.Body.toString('utf-8');
}

const parseCsv = (csv) => {
  return parse(csv, {
    columns: true,
    skip_empty_lines: true
  });
}

const getPutRequestList = (produtos) => produtos.map((produto) => ({
  PutRequest: {
    Item: {
      ...produto,
    }
  }
}))

const mapProdutosToDynamoRequest = (produtos) => {
    const requestItems = {};
    requestItems[TABLE_NAME] = getPutRequestList(produtos);
    return { RequestItems: requestItems };
};

const writeToDynamo = async (requestItems, numberOfSecondsRetry = 2, retries = 0) => {
  const { UnprocessedItems } = await documentClient.batchWrite(requestItems).promise();

  if (Object.keys(UnprocessedItems).length && retries < MAX_TRIES) {
    retries++;
    await delay(numberOfSecondsRetry)
    await writeToDynamo(UnprocessedItems, numberOfSecondsRetry ** 2, retries);
  }
}

exports.handler = async () => {
  const produtosCsv = await getCsv();
  const produtos = parseCsv(produtosCsv);

  const batchSize = 25;
  while (produtos.length > 0) {
    const produtosBatch = produtos.splice(0, batchSize);
    const dynamoRequestItems = mapProdutosToDynamoRequest(produtosBatch);
    await writeToDynamo(dynamoRequestItems);
  }
}