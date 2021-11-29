let doc = require('dynamodb-doc');
// const AWS = require('aws-sdk');
// const docClient = new AWS.DynamoDB.DocumentClinet();
let dynamo = new doc.DynamoDB();
const tableName = process.env.TableName;

exports.handler = async (event) => {
    var params = {
        "TableName": tableName,
        "Key": {
            id: event.pathParameters.id
        }
    }

    docClient.get(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.Item);
        }
      });
}


const createResponse = (statusCode, body) => {
    return {
        "statusCode": statusCode,
        "body": body || ""
    }
};


