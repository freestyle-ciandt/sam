const aws = require('aws-sdk')
const docClient = new aws.DynamoDB.DocumentClient({region: process.env.AWS_REGION})
const handler = async (event) => {
    console.log('event', event);
    const { id } = event.pathParameters
    const params = {
        TableName: 'dma-clientes',
        Key: { id }
    };
    const { Item } = await docClient.get(params).promise();
    console.log('Item', Item);
    return {
        statusCode: 200,
        body: JSON.stringify(Item)
    }
};

module.exports = { handler };
