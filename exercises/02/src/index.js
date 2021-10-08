
const handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'it works!'
        })
    }
};

module.exports = { handler };
