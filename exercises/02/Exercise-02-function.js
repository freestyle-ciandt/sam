const { DynamoDB } = require('aws-sdk');
const docClient = new DynamoDB.DocumentClient();

exports.handler = async function (event, context) {
	console.log("EVENT: \n" + JSON.stringify(event, null, 2))

	switch(event.resource) {
		case '/exercise-02/cidade/{cidade}': 
			return queryByCidade(event);
		case '/exercise-02/{id}': 
			return queryById(event);
	}
};

const queryById = async (event) => {
	console.log('Query by id')
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
}

const queryByCidade = async (event) => {
	console.log('Query by cidade')
	const city = unescape(event.pathParameters.cidade)
	const params = {
		TableName : 'mrn-clientes',
		IndexName : 'cidade-index',
		KeyConditionExpression: 'cidade = :cidade',
		ExpressionAttributeValues: {
			':cidade': city
		},
	}
	const data = await docClient.query(params).promise()
	return {
		statusCode: 200,
		body: JSON.stringify(data.Items)
	};
}