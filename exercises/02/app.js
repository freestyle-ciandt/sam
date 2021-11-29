const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();


const tableName = process.env.TableName;

exports.handler = async (event) => {
  console.log(event.pathParameters)
  var params = {
    "TableName": tableName,
    "Key": {
      id: event.pathParameters.id
    }
  }
  try {
    const response = await docClient.get(params).promise();
    console.log(response)
  } catch (error) {
    console.log(error)
  }

}


const createResponse = (statusCode, body) => {
  return {
    "statusCode": statusCode,
    "body": body || ""
  }
};


