const aws = require('aws-sdk')
const docClient = new aws.DynamoDB.DocumentClient({region: process.env.AWS_REGION})
const handler = async () => {
    const params = {TableName: 'dma-clientes', Key: {id: 1}}
    const result = await docClient.get(params).promise()
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'it works!',
            result
        })
    }
};

module.exports = { handler };
