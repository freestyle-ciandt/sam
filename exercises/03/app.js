exports.handlerProduto = async (event) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'TOP',
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
}