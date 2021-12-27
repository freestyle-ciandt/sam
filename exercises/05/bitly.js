
const generateResponse = (code, message) => ({
    statusCode: code,
    body: JSON.stringify({ message })
});

exports.create = async (event) => {
    console.log(JSON.stringify(event));

    const { requestContext } = event;
    const { claims } = requestContext.authorizer;

    if (!claims || claims.email_verified == 'false') {
        return generateResponse(401, 'Unauthorized');
    }

    return generateResponse(200, claims['cognito:groups']);
};

exports.redirect = async (event) => {
    console.log(JSON.stringify(event));
    return {
        statusCode: 301,
        headers: {
            Location: 'https://google.com'
        }
    }
};