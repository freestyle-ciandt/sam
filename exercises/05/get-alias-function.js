const AWS = require('aws-sdk')
const jose = require('jose')

const { DynamoDB } = AWS
const { AliasesTableName } = process.env

const docClient = new DynamoDB.DocumentClient()

const getId = () => { 
    return Date.now().toString(36)
}

const getUrl = async id => {
    const params = {
        TableName: AliasesTableName,
        Key: { id }
    }

    try {
        console.log('getUrl try')
        return await docClient.get(params).promise();
    } catch (error) {
        console.log('getUrl catch:', error)
    }
}

exports.handler = async (event, _context, callback) => {
    console.log('getAliasFunction', event)

    const { id } = event.pathParameters

    const body = {};

    try {
        const data = await getUrl(id)
        const { url } = data.Item
        console.log('url', url)

        const response = {
            statusCode: 301,
            headers: {
                Location: url,
            }
        };
        
        return callback(null, response);
    } catch(error) {
        console.log('handler: getUrl error', error)
        body.status = 'Error';
        body.error = error;
    }

    return {
        body: JSON.stringify(body)
    }
}