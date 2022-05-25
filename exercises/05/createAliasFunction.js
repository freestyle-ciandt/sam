const { DynamoDB } = require('aws-sdk');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const { TABLE_NAME } = process.env;

const docClient = new DynamoDB.DocumentClient({ AWS_REGION });

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateId = (length) => {
    let result = '';
    for (let i = 0; i< length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

exports.lambdaHandler = async (event) => {
    console.log('createAliasFunction - event', event);

    const { domainName } = event.requestContext;
    const { url } = JSON.parse(event.body).data;
    const idToken = event.headers.Authorization;

    const pem = jwkToPem(jwk);
    jwt.verify(idToken, pem, { algorithms: ['RS256'] }, function(err) {
        if(err) {
            return {
                'statusCode': 403,
                'body': JSON.stringify({
                    message: 'Unauthorized'
                })
            }
        }
    });

    const { email_verified, 'cognito:group': cognitoGroups, sub } = jwt.decode(idToken);

    if(!email_verified) {
        return {
            'statusCode': 403,
            'body': JSON.stringify({
                message: 'Email is not verified'
            })
        }
    }

    if(!cognitoGroups || !cognitoGroups.length) {
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
        Key: {
            id: shortenedUrlId,
            url: url,
            uuid: sub,
            tipo: cognitoGroups[0],
        },
        ConditionExpression: 'attribute_not_exists(id)',
    })
}