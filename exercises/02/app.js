const { DynamoDB } = require('aws-sdk');
const { TABLE_NAME } = process.env;
const docClient = new DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.queryById = async(event) => {
    console.log("Event: \n", JSON.stringify(event, null, 2))
    const { id } = event.pathParameters;

    const params = {
        TableName: TABLE_NAME,
        Key:{
            id: parseInt(id, 10)
        }}

    const { Item: cliente } = await docClient.get(params).promise();
    console.log("Dynamodb response \n", cliente)

    return {
        'statusCode': 200,
        'body': JSON.stringify(cliente)
    }
}

exports.queryByCity = async(event) => {
    console.log("Event: \n", JSON.stringify(event, null, 2))
    const { cidade } = event.pathParameters;

    const params = {
        TableName: TABLE_NAME,
        IndexName: 'cidade-index',
        KeyConditionExpression: 'cidade = :cidade',
        ExpressionAttributeValues: {
            ':cidade': decodeURI(cidade)
        }
    }

    const cidades = await docClient.query(params).promise();
    console.log("Dynamodb response \n", cidades)

    return {
        'statusCode': 200,
        'body': JSON.stringify(cidades.Items)
    }

}