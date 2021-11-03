const { DynamoDB } = require('aws-sdk');

const docClient = new DynamoDB.DocumentClient({
    region: process.env.REGION,
});

const get = async (tableName, keys) => {
    try {
        const { Item: item } = await docClient.get({
            TableName: tableName,
            Key: keys
        }).promise();
        return item;
     } catch  (e) {
         console.log(`Unable to run operation against ${tableName} DynamoDB table.`, { e });
         return null;
     }
};

const remove = async (tableName, keys) => {
    try {
        const { Item: item } = await docClient.delete({
            TableName: tableName,
            Key: keys
        }).promise();
        return item;
     } catch  (e) {
         console.log(`Unable to run operation against ${tableName} DynamoDB table.`, { e });
     }
}

module.exports = {
    get,
    remove,
}