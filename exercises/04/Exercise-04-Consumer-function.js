const { DynamoDB } = require('aws-sdk');

const { TABELA_MRN_CLIENTES } = process.env;

const delay = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));
const MAX_TRIES = 5;

const writeToDynamo = async (documentClient, requestItems, numberOfSecondsRetry, retries) => {
  const { UnprocessedItems } = await documentClient.batchWrite(requestItems).promise();
  console.log('UnprocessedItems', UnprocessedItems)
  if (UnprocessedItems.length && retries < MAX_TRIES) {
    retries++;
    await delay(numberOfSecondsRetry)
    await writeToDynamo(UnprocessedItems, numberOfSecondsRetry * 2, retries);
  }
}

exports.handler = async function (event) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  const { Records } = event;

  console.log('Creating DynamoDB instance');
  const dynamoDb = new DynamoDB({
    maxRetries: 1
  });

  console.log('Creating DynamoDB.DocumentClient instance');
  const documentClient = new DynamoDB.DocumentClient({
    service: dynamoDb
  });

  const putRequestDataList = [];

  console.log('Building putRequestDataList list...');
  Records.forEach(element => {
    const { body } = element;
    const clientData = JSON.parse(body);

    const putRequestData = {
      PutRequest: {
        Item: {
          ...clientData
        }
      }
    };
    console.log(putRequestData);

    putRequestDataList.push(putRequestData);


    // TODO NEXT
    // Insert Records into DB

    // If possible, check batch receive functionality
  });

  const dynamoRequestItems = {
    RequestItems: {
      [TABELA_MRN_CLIENTES]: putRequestDataList
    }
  };

  console.log('Calling writeToDynamo with the following data');
  console.log(dynamoRequestItems);

  await writeToDynamo(documentClient, dynamoRequestItems, 2, 0);
};
