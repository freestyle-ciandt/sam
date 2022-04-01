const { TABLE_NAME } = process.env;

const alphaChars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"];

const aws = require('aws-sdk');
const docClient = new aws.DynamoDB.DocumentClient();

const generator = (len) => {
   return [...Array(len)]
     .map(i => alphaChars[Math.random()*alphaChars.length|0])
     .join('');
};

exports.handler = async (event) => {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))

    // Get url
    const body = JSON.parse(event.body);
    const { url } = body.data;

    // Generate id
    const id = generator(8);

    // Get user sub
    const { sub:uuid } = event.requestContext.authorizer.claims;

    // Get user group
    const tipo = event.requestContext.authorizer.claims['cognito:groups'];

    const params = {
      TableName: TABLE_NAME,
      Key:{ 
        "id": id,
        "tipo": tipo
        },
      UpdateExpression: "set urlx = :url, uuidx = :uuid",
      ExpressionAttributeValues:{
        ":url": url,
        ":uuid": uuid
      },
      ReturnValues:"ALL_NEW"        
      // ConditionExpression: 'ALGUMA CONDICAO AQUI',
    };
    console.log({ params });
    
    await docClient.update(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
          message: `This is the text: ${id}`,
        }),
      };
}








// curl -X POST https://l7lefqtz30.execute-api.us-east-1.amazonaws.com/prod/shortenurl -H "Authorization: eyJraWQiOiJZS3F4YzBXWFFhSWZpdlNGZUc0TDhPM3NZXC82MUNaUmlHQXZQV2RBTmdmUT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiZUs0clg3UFlwZGZ6Nkg1RDBsX21KQSIsInN1YiI6ImJhMzM2OWY5LTQ2NTUtNGU0My1hOWIyLTU1MTNlZDdkNmJhMSIsImNvZ25pdG86Z3JvdXBzIjpbImZyZWVfYWNjb3VudCJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfaHVkT2hteWlCIiwiY29nbml0bzp1c2VybmFtZSI6Im1hbmRvIiwiYXVkIjoiMWExNGxqb3RmYzlxOGs4cm8xY2I0dGcyZHYiLCJldmVudF9pZCI6ImQ4OTUwMTYyLWE3MDYtNGNmYi05NGIxLWU2Nzg2MWE1Yzg5ZCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ4MjE2MjUxLCJleHAiOjE2NDgyMTk4NTEsImlhdCI6MTY0ODIxNjI1MSwianRpIjoiM2RjNDZmYTctNTg5MS00NmNkLThmNTMtM2I4ZGRjZjMyNmM5IiwiZW1haWwiOiJtYW5kb2xlc2lAY2lhbmR0LmNvbSJ9.ca_R2K1gXCmFYIQ14bScDbEa9oEEVw9OSDUpozg6ki2hAW8coprqzdYzfYTJ0Lh5RSLLZUsmONYUxhKk9rmU9MLNRofSYaaGMMvgBjoUihjnZUAlh7f_2GDtGuitYrJPVhaPANVGFUiTEdjicZz5ucBzhcp9zLmi9APxXWGPaD7faxQutz9ohMccVIVD1ukIc4eXjj1ULHvykneuzYS2D555CqITyoax935IpRcgq5H5o7NjxxfrPzrwrRJNkh1Wu5g5rlwW4vW1z5kpm74GYBIJ7dgNNk_lMlaZgW0kOKZshaf8IHQT7VZYBPC5b7mSqm1n4Z0R8HdyJLU4MAZ4CQ" -d '{"data": {"url": "http://abc.com.br"}}'