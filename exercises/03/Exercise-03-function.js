
const parse = require('csv-parse/lib/sync');
const { S3, DynamoDB } = require('aws-sdk');

const { BUCKET_PRODUTOS } = process.env;

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

const writeToDynamo = async (requestItems) => {
  const dynamoDb = new aws.DynamoDB({
    maxRetries: 999
  })
  const documentClient = new aws.DynamoDB.DocumentClient({
    service: dynamoDb,
    convertEmptyValues: true
  })
  const data = await documentClient.batchWrite(requestItems).promise();
  console.log({ data });
}

exports.handler = async () => {
  const produtosCsv = await getCsv();
  const produtos = parseCsv(produtosCsv);

  const batchSize = 25;
  while (produtos.length > 0) {
    const produtosBatch = produtos.splice(0, batchSize);
    const dynamoRequestItems = mapProdutosToDynamoRequest(getPutRequestList(produtosBatch));
    console.log('dynamoRequestItems', dynamoRequestItems)
    await writeToDynamo(dynamoRequestItems);
  }

  console.log(produtos);
}