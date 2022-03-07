const { DynamoDB } = require('aws-sdk');
const { TABLE_NAME } = process.env;
const docClient = new DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.get = async(event) => {
    const { id } = event.pathParameters;

    const params = {
        TableName: TABLE_NAME,
        Key:{
            id: id
        }}

    const client = docClient.get({params}).promise();

    return {
        'statusCode': 200,
        'body': client
    }
}

exports.query = async(event) => {
    const { cidade } = event.pathParameters;

    const params = {
        TableName: TABLE_NAME,
        IndexName: 'cidade-index',
        KeyConditionExpression: 'cidade = :cidade',
        ExpressionAttributeValues: {
            ':cidade': cidade
        }
    }

    const client = docClient.query(params).promise();

    return {
        'statusCode': 200,
        'body': client
    }

}