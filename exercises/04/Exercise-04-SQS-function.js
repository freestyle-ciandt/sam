const { DynamoDB } = require('aws-sdk');
const { TableName } = process.env;

const docClient = new DynamoDB.DocumentClient();

exports.handler = async event => {

    const data = event.Records;

    data.forEach(dataRecords => {
        const json = JSON.parse(dataRecords.body)

        var params = {
            TableName: TableName,
            Item: json
        };

        try {
            const response = await docClient.put(params).promise()
            console.log(response)
        } catch (error) {
            console.log(error)

        }

    });



}