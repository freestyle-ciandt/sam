const { TABLE_NAME } = process.env;

const alphaChars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"];

const aws = require("aws-sdk");
const docClient = new aws.DynamoDB.DocumentClient();

const generator = (len) => {
  return [...Array(len)]
    .map((i) => alphaChars[(Math.random() * alphaChars.length) | 0])
    .join("");
};

exports.handler = async (event) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  // Get url
  const body = JSON.parse(event.body);
  const { url } = body.data;

  // Generate id
  let id = generator(8);

  // Get user sub
  const { sub: uuid } = event.requestContext.authorizer.claims;

  // Get user group
  const tipo = event.requestContext.authorizer.claims["cognito:groups"];

  let params = createParams(id, url, uuid, tipo);

  try {
    await docClient.update(params).promise();
  } catch (err) {
    if (err.code === "ConditionalCheckFailedException") {
      id = generator(8);
      params = createParams(id, url, uuid, tipo);
      await docClient.update(params).promise();
    } else {
      throw err;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `This is the text: ${id}`,
    }),
  };
};

function createParams(id, url, uuid, tipo) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
    UpdateExpression: "set urlx = :url, uuidx = :uuid, tipo = :tipo",
    ExpressionAttributeValues: {
      ":url": url,
      ":uuid": uuid,
      ":tipo": tipo,
    },
    ReturnValues: "ALL_NEW",
    ConditionExpression: "attribute_not_exists(id)",
  };
  console.log({ params });
  return params;
}