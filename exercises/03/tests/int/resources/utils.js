const { readFileSync } = require('fs');
const {
    CloudFormation,
    S3,
    Lambda,
    DynamoDB,
    CloudWatchEvents,
} = require('aws-sdk');
const parseCSV = require('csv-parse/lib/sync');

const getStackOutputs = async (stackName, region) => {
    try {
        const cfn = new CloudFormation({ region });
        const { Stacks: stacks } = await cfn.describeStacks({  StackName: stackName }).promise();

        const { Outputs: outputs } = stacks[0];

        return outputs.reduce((acc, output) => {
            const { OutputKey, OutputValue } = output;
            acc[OutputKey] = OutputValue;
            return acc;
        }, {});
    } catch (e) {
        return {};
    }
};

const uploadFileToS3 = async (bucketName, objectName, fileToUpload) => {
    try {
        const s3 = new S3();
        const fileToUploadBuffer = readFileSync(fileToUpload);
        await s3.putObject({
            Bucket: bucketName,
            Key: objectName,
            Body: fileToUploadBuffer,
        }).promise();
    } catch (e) {
        console.log('Unable to upload file to S3 Bucket', { e });
    }
};

const invokeLambda = async (lambdaArn, region) => {
    try {
        const lambda = new Lambda({ region });
        await lambda.invoke({
            FunctionName: lambdaArn,
            InvocationType: 'RequestResponse',
        }).promise();
    } catch (e) {
        console.log(`Unable to invoke Lambda function ${lambdaArn}`, { e });
    }
};

const convertCSVToObject = (csvFilePath) => {
    try {
        const fileToUpload = readFileSync(csvFilePath);
        const records = parseCSV(fileToUpload, {
            columns: true,
            skip_empty_lines: true
        });
        return records;
    } catch (e) {
        console.log('Unable to convert CSV file to JSON', { e });
    }
};

const getRegisterFromDynamoDB = async (tableName, region, id) => {
    try {
        const docClient = new DynamoDB.DocumentClient({ region });
        const { Item: item } = await docClient.get({
            TableName: tableName,
            Key: {
                id,
            }
        }).promise();
        return item;
     } catch  (e) {
         console.log(`Unable to run operation against ${tableName} DynamoDB table.`, { e });
     }
}

const deleteRegisterFromDynamoDB = async (tableName, region, id) => {
    try {
        const docClient = new DynamoDB.DocumentClient({ region });
        const { Item: item } = await docClient.delete({
            TableName: tableName,
            Key: {
                id,
            }
        }).promise();
        return item;
     } catch  (e) {
         console.log(`Unable to run operation against ${tableName} DynamoDB table.`, { e });
     }
}

const findTriggerSourceArn = async (lambdaArn, region, servicePrincipal) => {
    try {
        const lambda = new Lambda({ region });
        const { Policy: policy } = await lambda.getPolicy({
            FunctionName: lambdaArn,
        }).promise();

        const { Statement: statement } = JSON.parse(policy);
        const trigger = statement.find((policy) => policy.Principal.Service == servicePrincipal);
        return trigger.Condition.ArnLike['AWS:SourceArn'];
    } catch (e) {
        console.log(`Unable to find a trigger with the ${servicePrincipal} service principal.`, { e });
        return null;
    }
};

const getCloudWatchEventRuleScheduleExpression = async (cloudWatchEventArn, region) => {
    try {
        const cwe = new CloudWatchEvents({ region });
        const { ScheduleExpression: scheduleExpression } = await cwe.describeRule({
            Name: cloudWatchEventArn.substring(cloudWatchEventArn.lastIndexOf('/') + 1),
        }).promise();
        return scheduleExpression;
    } catch (e) {
        console.log(`Unable to find schedule for CloudWatch event ${cloudWatchEventArn}`, { e });
    }
};

module.exports = {
    getStackOutputs,
    uploadFileToS3,
    invokeLambda,
    convertCSVToObject,
    getRegisterFromDynamoDB,
    deleteRegisterFromDynamoDB,
    findTriggerSourceArn,
    getCloudWatchEventRuleScheduleExpression,
}