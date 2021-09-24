
const handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'This is the solution for exercise 01'
        }),
    };
};

module.exports = {
    handler,
};
