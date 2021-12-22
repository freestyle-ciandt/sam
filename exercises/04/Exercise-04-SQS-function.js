const { DynamoDB } = require('aws-sdk');
const { TableName } = process.env;

const docClient = new DynamoDB.DocumentClient();

exports.handler = async event => {

    const data = event.Records;

    await Promise.all(
        data.map(dataRecords => {
            console.log('dataRecords:', dataRecords.body)
            const json = JSON.parse(dataRecords.body)
    
            var params = {
                TableName: TableName,
                Item: json
            };
    
            try {
                return docClient.put(params).promise()
            } catch (error) {
                console.log(error)
            }
        })
    );
}