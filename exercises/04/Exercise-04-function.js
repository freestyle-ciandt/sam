const { SQS } = require('aws-sdk');
const sqs = new SQS();
const { QueueUrl } = process.env;

const validate = require('validate-fields')()
const schema = {
    id: 'uint(1,)',
    nome: 'string(1,)',
    documento: 'string(1,)',
    cidade: 'string(1,)',
    estado: 'string(1,)',
    pais: 'string(1,)',
    id_plano: 'uint(1,)'
}

exports.handler = async event => {
    if (!event.body) {
        return
    }
     const data = JSON.parse(event.body);
     const isValid = validate(schema, data, {strict: true})
     
     console.log('isValid: ', isValid)

    if (!isValid)
    {
        return createResponse(400, {
            "message": "Invalid Input"
        });
    }


    

    const params = {
        MessageBody: event.body,
        QueueUrl,
    }

    try {
        const response = await sqs.sendMessage(params).promise()
        console.log('sendMessage response', response);
    } catch (err) {
        console.log('sendMessage error', err);
    }

    return createResponse(200, {
        "message": "Success"
    });
}

const createResponse = (statusCode, json) => {
    return {
        statusCode,
        body: JSON.stringify(json)
    }
}