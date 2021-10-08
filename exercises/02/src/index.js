const aws = require('aws-sdk')
const docClient = new aws.DynamoDB.DocumentClient({region: process.env.AWS_REGION})
const handler = async (event) => {
    console.log('event', event);
    const { id } = event.pathParameters
    const params = {
        TableName: 'dma-clientes',
        Key: { id: parseInt(id, 10) }
    };
    const { Item } = await docClient.get(params).promise();
    console.log('Item', Item);
    if (Item){
        return {
            statusCode: 200,
            body: JSON.stringify(Item)
        }   
    }
    return {
        statusCode: 404,
        body: JSON.stringify({message: 'Cliente não encontrado'})
    }
};

module.exports = { handler };
