
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

var params = {
  RequestItems: {
    'sam-dojo-mandolesi-e-rafael-produtos': [
      {
        PutRequest: {
          Item: {
            id: 'anotherKey',
            NumAttribute: 1,
            BoolAttribute: true,
            ListAttribute: [1, 'two', false],
            MapAttribute: { foo: 'bar' }
          }
        }
      }
    ]
  }
};

var documentClient = new AWS.DynamoDB.DocumentClient();


exports.handler = async () => {
  const produtosCsv = await getCsv();
  const produtos = parseCsv(produtosCsv);

  console.log(produtos);
}