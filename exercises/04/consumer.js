const { DynamoDB } = require("aws-sdk");
const { TABLE_NAME } = process.env;
const docClient = new DynamoDB.DocumentClient({ region: "us-east-1" });

const mountDynamoDBRequest = (records) => {
  const putRequests = records.map((message) => {
    const { body } = message;
    console.log('body', body);
    const messageObj = JSON.parse(body);
    console.log('messageObj', messageObj);

    return { PutRequest: { Item: { ...messageObj } } };
  });
  const dynamoRequest = { RequestItems: {} };
  dynamoRequest.RequestItems[TABLE_NAME] = putRequests;
  console.log("dynamoRequest: ", JSON.stringify(dynamoRequest));
  return dynamoRequest;
};
const writeToDatabase = async (value) => {
  let retryCount = 0;
  const res = await docClient.batchWrite(value).promise();
  console.log("consumer - writeToDatabase-res:", res);

  if (res.UnprocessedItems && res.UnprocessedItems.length > 0) {
    if (retryCount > 2) {
      throw new Error(res.UnprocessedItems);
    }
    return batchWrite(res.UnprocessedItems, retryCount + 1);
  }
};

exports.get = async (event) => {
  const { Records } = event;
  console.log("consumer - Records:", Records);

  try {
    const dynamoRequestItem = mountDynamoDBRequest(Records);
    console.log("consumer - dynamoRequestItem:", dynamoRequestItem);

    await writeToDatabase(dynamoRequestItem);
    console.log("Successfully wrote SQS message to dynamoDB");
  } catch (err) {
    console.log("Error:", err);
  }
};
