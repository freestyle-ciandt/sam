const { SQS } = require("aws-sdk");
const { SQS_URL } = process.env;
const sqsClient = new SQS({ apiVersion: "2012-11-05" });

exports.post = async (event) => {
  const { body } = event;
  console.log("producer - body:", body);
  const newBody = JSON.parse(body);

  if (Object.values(newBody).some((item) => !item)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid Input" }),
    };
  }

  const params = {
    MessageBody: body,
    QueueUrl: SQS_URL,
  };
  console.log("producer - params:", params);

  try {
    const success = await sqsClient.sendMessage(params).promise();
    console.log("producer - success:", success);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (err) {
    console.log("Error:" + JSON.stringify(err));
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send SQS message" }),
    };
  }
};
