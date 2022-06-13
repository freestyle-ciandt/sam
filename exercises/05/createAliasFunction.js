const { DynamoDB } = require('aws-sdk');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const { TABLE_NAME, AWS_REGION } = process.env;

const docClient = new DynamoDB.DocumentClient({ region: AWS_REGION });

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const jwk = {
  kty: 'RSA',
  n: '4gLc5Xq9XmXz5LKjrQWkkQlDUsML_s3Uapf8LyMK7Ag3O1Wn9SOQMFn-U5kKbEunE7oga147AliVaG__FXODdcYrUM50ASYnbMPRy01BTg0RaiGv55XQajkcCX0ERVrXljwHUfqBzkaqD3usv1dGWukNNAykGRNszk9LunnUjeNDXNi1QafpYIMWXkUj_ofmSyLv6QNFgUHF9aAd7KX-Wcpgx55NBE6afG5auJlBSyrzNdBm9zK1IJ28sfFXt4gbHiIy9S6XyEb4E7xMKNOJtUIFxWcEs8yNMsi87Xeuwc8Q6yMQxstNw1hOGNVuyLpp65BhHHHz4p38b3DlzjFm6w',
  e: 'AQAB'
};

const generateId = (length) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

exports.lambdaHandler = async (event) => {
  const { domainName } = event.requestContext;
  const { url } = JSON.parse(event.body).data;
  const idToken = event.headers.Authorization;

  const pem = jwkToPem(jwk);
  jwt.verify(idToken, pem, { algorithms: ['RS256'] }, function (err) {
    if (err) {
      return {
        'statusCode': 403,
        'body': JSON.stringify({
          message: 'Unauthorized'
        })
      }
    }
  });

  const { email_verified, 'cognito:groups': cognitoGroups, sub } = jwt.decode(idToken.replace('Bearer ', ''));
  if (!email_verified) {
    return {
      'statusCode': 403,
      'body': JSON.stringify({
        message: 'Email is not verified'
      })
    }
  }

  if (!cognitoGroups || !cognitoGroups.length) {
    return {
      'statusCode': 403,
      'body': JSON.stringify({
        message: 'User has no group assigned'
      })
    }
  }

  const shortenedUrlId = generateId(8);

  await docClient.put({
    TableName: TABLE_NAME,
    Item: {
      id: shortenedUrlId,
      url: url,
      uuid: sub,
      tipo: cognitoGroups[0],
    },
    ConditionExpression: 'attribute_not_exists(id)',
  }).promise();

  return {
    'statusCode': 200,
    'body': JSON.stringify({
      message: 'Success',
      data: {
        alias: `https://${domainName}/${shortenedUrlId}`
      }
    })
  }
}
