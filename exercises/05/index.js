const generateRandomAlphaNumericStr = () => Array.from(
  Array(8), () => Math.floor(Math.random() * 36).toString(36)
).join('');

exports.handler = async function (event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  console.log("CONTEXT: \n" + JSON.stringify(context, null, 2));

  const { body, requestContext } = event;
  const parsedBody = JSON.parse(body);

  try {
    const claims = requestContext.authorizer.claims;
    const group = claims['cognito:groups'];
    const uuid = claims.sub;
    const id = generateRandomAlphaNumericStr();
    const { url } = parsedBody.data;

    console.log({
      group,
      id,
      uuid,
      url
    })

  } catch (err) {
    console.log(err);
  }
  

  return {
    statusCode: 200,
    body: "Success! Item inserted in queue.",
  };
};