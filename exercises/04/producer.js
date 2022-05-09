const { SQS } = require("aws-sdk");
const { SQS_URL } = process.env;
const sqsClient = new SQS({ apiVersion: "2012-11-05" });

function verifyData(body) {
  let validate = true;
  Object.values(body).forEach((item) => {
    switch (typeof item) {
      case "number":
        if (item === 0 || !item) {
          validate = false;
        }
        break;
      case "string":
        if (!item) {
          validate = false;
        }
        break;
    }
  });
  return !validate;
}

exports.post = async (event) => {
  const { body } = event;

  console.log("producer - body:", body);

  // console.log(Object.values(body).some((item) => !item)
  //   ">> TESTE: ",
  //   Object.values(body).some((item) => !item),
  //   !body?.id_plano && !body?.id
  // );

  // if (verifyData(body)) {
  //   return {
  //     statusCode: 400,
  //     body: JSON.stringify({ message: "Invalid Input" }),
  //   };
  // }

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
