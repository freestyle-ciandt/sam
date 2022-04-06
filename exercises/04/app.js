const { DynamoDB, SQS } = require('aws-sdk');
const { TABLE_NAME, SQS_URL } = process.env;
const docClient = new DynamoDB.DocumentClient({ region: 'us-east-1' });
const sqsClient = new SQS({ apiVersion: "2012-11-05" });

const mountDynamoDBRequest = (records) => {
    const putRequests = records.map(message => {
        const { body } = message;
        const messageObj = JSON.parse(body);
        return { PutRequest: { Item: { ...messageObj } } }
    });
    const dynamoRequest = { RequestItems: {} };
    dynamoRequest.RequestItems[TABLE_NAME] = putRequests;
    return dynamoRequest
  };
  const writeToDatabase = async (value) => {
    let retryCount = 0
    const res = await docClient.batchWrite(value).promise();
  
      if(res.UnprocessedItems && res.UnprocessedItems.length > 0) {
          if (retryCount > 2) {
              throw new Error(res.UnprocessedItems);
          }
          return batchWrite(res.UnprocessedItems, retryCount + 1);
      }
  }

exports.get = async(event) => {
    const { Records } = event;

    try {
        const dynamoRequestItem = mountDynamoDBRequest(Records);
        await writeToDatabase(dynamoRequestItem);
        console.log('Successfully wrote SQS message to dynamoDB');
    } catch (err) {
        console.log('Error:', err);
    }
}

exports.post = async(event) => {
    const { body } = event;

    // if(Object.values(body).some(item => !item)){
    //     return {
    //         'statusCode': 400,
    //         'message': 'Invalid Input'
    //     }
    // }

    const params = {
        MessageBody: JSON.stringify(body),
        QueueUrl: SQS_URL
    }

    try {
        await sqsClient.sendMessage(params).promise();
        return {
            'statusCode': 200,
            'message': 'Success'
        }
    } catch(err) {
        console.log("Error:" + JSON.stringify(err));
        return {
            'statusCode': 500,
            'message': 'Failed to send SQS message',
        }
    }
}