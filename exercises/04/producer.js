const { SQS } = require("aws-sdk");
const { SQS_URL } = process.env;
const sqsClient = new SQS({ apiVersion: "2012-11-05" });

exports.post = async (event) => {
  const { body } = event;
  console.log("producer - body:", body);

  console.log('>> TESTE: ', Object.values(body).some(item => !item))
  if(Object.values(body).some(item => !item)){
      return {
          statusCode: 400,
          body: 'Invalid Input'
      }
  }

  const params = {
    MessageBody: body,
    QueueUrl: SQS_URL,
  };
  console.log("producer - params:", params);

  try {
    const success = await sqsClient.sendMessage(params).promise();
    console.log('producer - success:', success);

    return {
      statusCode: 200,
      body: "Success",
    };
  } catch (err) {
    console.log("Error:" + JSON.stringify(err));
    return {
      statusCode: 500,
      body: "Failed to send SQS message",
    };
  }
};
