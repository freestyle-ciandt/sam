
const parse = require('csv-parse/lib/sync');
const { S3 } = require('aws-sdk');
const { BUCKET_PRODUTOS } = process.env;

const getCsv = async () => {
  const s3Instance = new S3();
  const produtosCsv = await s3Instance.getObject({
    Bucket: BUCKET_PRODUTOS
  }).promise();

  return produtosCsv;
}

const parseCsv = (csv) => {
  return parse(csv, {
    columns: true,
    skip_empty_lines: true
  });
}

exports.handler = () => {
  const produtosCsv = getCsv();
  const produtos = parseCsv(produtosCsv);

  console.log(produtos);
}