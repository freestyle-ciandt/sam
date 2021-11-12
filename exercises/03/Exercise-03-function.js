
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

const mapProdutosToDynamoRequest = (produtos) => {
  const putRequestList = produtos.map(produto => {
    return {
      PutRequest: {
        Item: {
          ...produto
        }
      }
    }
  })
  return {
    RequestItems: {
      'sam-dojo-mandolesi-e-rafael-produtos': putRequestList
    }
  };
};

const writeToDynamo = async (requestItems) => {
  const documentClient = new DynamoDB.DocumentClient();
  const data = await documentClient.batchWrite(requestItems).promise();
  console.log({ data });
}

exports.handler = async () => {
  const produtosCsv = await getCsv();
  const produtos = parseCsv(produtosCsv);
  const dynamoRequestItems = mapProdutosToDynamoRequest(produtos);
  console.log({ dynamoRequestItems });
  await writeToDynamo(dynamoRequestItems);

  console.log(produtos);
}