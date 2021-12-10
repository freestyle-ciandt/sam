exports.handler = async function (event) {
	console.log("EVENT: \n" + JSON.stringify(event, null, 2));

	return {
		statusCode: 200,
		body: 'uhul'
	};
};