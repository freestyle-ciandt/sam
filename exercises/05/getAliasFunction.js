const { TABLE_NAME } = process.env;

const aws = require("aws-sdk");
const docClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    const alias = event.pathParameters.alias;
    const message = `Received alias: "${alias}"`;
    console.log(message);

    const params = {
		TableName : TABLE_NAME,
		KeyConditionExpression: 'id_alias = :alias',
		ExpressionAttributeValues: {
			':alias': alias
		},
	}
	const data = await docClient.query(params).promise()
    console.log({data});
    
    return {
		statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },		
		body: message
	};
}