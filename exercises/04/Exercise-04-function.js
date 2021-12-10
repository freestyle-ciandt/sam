const { SQS } = require('aws-sdk');
const sqs = new SQS();
const { QueueUrl } = process.env;

exports.handler = async event => {
    if (event.httpMethod === 'POST') {
        if (!event.body) {
            return 
        }

        // const data = JSON.parse(event.body);

        const params = {
            MessageBody: event.body,
            QueueUrl,
        }

        try {
            const response = await sqs.sendMessage(params).promise()
            console.log('sendMessage response', response)
        } catch (err) {
            console.log('sendMessage error', err)
        }

        return createResponse(200, {
            "message": "Success"
        })
    }

    event.Records.forEach(record => {
        const { body } = record
        console.log('Record body', body)
    })

    return {};
} 

const createResponse = (statusCode, json) => {
    return {
        statusCode,
        body: JSON.stringify(json)
    }
}