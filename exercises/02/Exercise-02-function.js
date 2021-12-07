const { DynamoDB } = require('aws-sdk');

const { AWS_REGION, TABLE_NAME } = process.env;

const docClient = new DynamoDB.DocumentClient({ region: AWS_REGION });

exports.get = async (event) => {
    const { id } = event.pathParameters;

	const { Item: client } = await docClient.get({
		TableName : TABLE_NAME,
		Key: {
			id: parseInt(id, 10)
		}
	}).promise();

	return {
		statusCode: 200,
		body: JSON.stringify(client),
	};
};

exports.query = async (event) => {
    const { cidade } = event.pathParameters;

	const data = await docClient.query({
		TableName : TABLE_NAME,
		IndexName : 'cidade-index',
		KeyConditionExpression: 'cidade = :cidade',
		ExpressionAttributeValues: {
			':cidade': unescape(cidade)
		},
	}).promise();

	return {
		statusCode: 200,
		body: JSON.stringify(data.Items)
	};
}