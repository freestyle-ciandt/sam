const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();


const tableName = process.env.TableName;

exports.handler = async (event) => {
  console.log(event.pathParameters)
  var params = {
    "TableName": tableName,
    "Key": {
      id: parseInt(event.pathParameters.id, 10)
    }
  }
  try {
    const response = await docClient.get(params).promise();
    console.log(response)
    if (response.Item) {
      return createResponse(200, response.Item)
    }

    return createResponse(404, {message: 'Client not found'})
  } catch (error) {
    console.log(error)
  }
}

const createResponse = (statusCode, body) => {
  return {
    "statusCode": statusCode,
    "body": JSON.stringify(body) || ""
  }
};


