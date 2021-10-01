exports.handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    const id = event.pathParameters.id
    return {
        statusCode: 200,
        body: JSON.stringify({
          message: `This is the solution for exercise 02: Client ID: ${id}`,
        }),
      };
};
