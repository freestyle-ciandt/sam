const aws = require("aws-sdk");

const { QUEUE_URL } = process.env;

aws.config.update({ region: 'us-east-1' });

exports.handler = async function (event) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  const { body } = event;

  const sqs = new aws.SQS({ apiVersion: "2012-11-05" });
  try {
    const data = await sqs
      .sendMessage({ MessageBody: JSON.stringify(body), QueueUrl: QUEUE_URL })
      .promise();
    console.log("Success, message sent.", data);
    return {
      statusCode: 200,
      body: "Success! Item inserted in queue.",
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: 500,
      body: "Something went wrong!",
    };
  }
};
