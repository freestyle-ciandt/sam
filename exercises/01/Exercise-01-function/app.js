const response = {
    statusCode: 200,
    body: {}
}

const data = {
    message: 'This is the solution for exercise 01'
}

exports.handler = async ()  => {
    console.log('Exercise-01-function - Called')
    response.body = JSON.stringify(data)
    return response
}