exports.handler = async event => {
    return createResponse(200, {
        "message": "Success"
    });
} 

const createResponse = (statusCode, json) => {
    return {
        statusCode,
        body: JSON.stringify(json)
    }
}