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
        "id": id
        },
      Item: {
        id,
        url,
        uuid,
        tipo
      },
      // ConditionExpression: 'ALGUMA CONDICAO AQUI',
    };

    await docClient.update(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
          message: `This is the text: ${id}`,
        }),
      };
}