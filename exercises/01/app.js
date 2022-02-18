let response;

exports.lambdaHandler = async () => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'This is the solution for exercise 01'
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
}