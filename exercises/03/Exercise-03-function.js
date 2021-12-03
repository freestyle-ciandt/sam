
const parse = require('csv-parse/lib/sync');
const { S3, DynamoDB } = require('aws-sdk');

const { BUCKET_PRODUTOS } = process.env;

const delay = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))
const MAX_TRIES = 5

const getCsv = async () => {
  const s3Instance = new S3();
  const produtosCsv = await s3Instance.getObject({
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

const getPutRequestList = (produtos) => produtos.map(produto => ({
  PutRequest: {
    Item: {
      ...produto,
      id: parseInt(produto.id, 10)
    }
  }
}))

const mapProdutosToDynamoRequest = (putRequestList) => ({
  RequestItems: {
    //TO-DO: Create environment var fot the table name
    'sam-dojo-mandolesi-e-rafael-e-neviton-produtos': putRequestList
  }
});

const writeToDynamo = async (requestItems, numberOfSecondsRetry, retries) => {
  const dynamoDb = new DynamoDB({
    maxRetries: 1
  })
  const documentClient = new DynamoDB.DocumentClient({
    service: dynamoDb,
    convertEmptyValues: true
  })
  const { UnprocessedItems } = await documentClient.batchWrite(requestItems).promise();
  console.log('UnprocessedItems', UnprocessedItems)
  if (UnprocessedItems.length && retries < MAX_TRIES) {
    retries++;
    await delay(numberOfSecondsRetry)
    await writeToDynamo(UnprocessedItems, numberOfSecondsRetry * 2, retries);
  }
}

exports.handler = async () => {
  const produtosCsv = await getCsv();
  const produtos = parseCsv(produtosCsv);

  const batchSize = 25;
  while (produtos.length > 0) {
    const produtosBatch = produtos.splice(0, batchSize);
    const dynamoRequestItems = mapProdutosToDynamoRequest(getPutRequestList(produtosBatch));
    console.log('dynamoRequestItems', dynamoRequestItems)
    await writeToDynamo(dynamoRequestItems, 2, 0);
  }

  console.log(produtos);
}