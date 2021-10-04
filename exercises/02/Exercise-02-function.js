const { DynamoDB } = require('aws-sdk');
const docClient = new DynamoDB.DocumentClient();

exports.handler = async function (event, context) {
	console.log("EVENT: \n" + JSON.stringify(event, null, 2))
	const id = parseInt(event.pathParameters.id, 10)

	const params = {
		TableName : 'mrn-clientes',
		Key: {
			id
		}
	}

	const {Item:client} = await docClient.get(params).promise()

	return {
		statusCode: 200,
		body: JSON.stringify(client),
	};
};
