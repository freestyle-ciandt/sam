const { DynamoDB } = require('aws-sdk');
const { TABLE_NAME, AWS_REGION } = process.env;

const docClient = new DynamoDB.DocumentClient({ region: AWS_REGION });


exports.lambdaHandler = async (event) => {
  console.log('event', event);
  const alias = event.pathParameters.alias;

  console.log('alias', alias);

  const data = await docClient.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': alias }
  }).promise()
  console.log('data', data);

  const { url } = data.Items[0];
  return {
    "statusCode": 301,
    "headers": {
      "Location": url
    }
  }
}