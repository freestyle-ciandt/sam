const chai = require('chai');

const {
    getStackOutputs,
    uploadFileToS3,
    invokeLambda,
    convertCSVToObject,
    getRegisterFromDynamoDB,
    deleteRegisterFromDynamoDB,
    findTriggerSourceArn,
    getCloudWatchEventRuleScheduleExpression,
} = require('./resources/utils');

const {
    expect,
} = chai;

const {
    STACK_NAME,
    REGION,
} = process.env;

const PRODUCTS_FILE_NAME = 'produtos.csv';
const PRODUCTS_CSV = `${process.cwd()}/exercises/03/tests/int/resources/${PRODUCTS_FILE_NAME}`;

describe('Given a S3 bucket', () => {
    let bucketName;
    let lambdaArn;
    let tableName;

    before(async () => {
        ({
            BucketName: bucketName,
            LambdaArn: lambdaArn,
            TableName: tableName
        } = await getStackOutputs(STACK_NAME, REGION));
    });

    describe('When a new version of products.csv is inserted and the lambda event is called', () => {
        let records;

        before(async () => {
            await uploadFileToS3(bucketName, PRODUCTS_FILE_NAME, PRODUCTS_CSV);
            await invokeLambda(lambdaArn, REGION);
            records = convertCSVToObject(PRODUCTS_CSV);
        });

        it('Then it should contains all registers in the DynamoDB', async () => {
            for (const record of records) {
                const dynamoDBItem = await getRegisterFromDynamoDB(tableName, REGION, record.id);
                expect(dynamoDBItem).to.be.eql(record);
            }
        });

        after(async () => {
            for (const record of records) {
                 await deleteRegisterFromDynamoDB(tableName, REGION, record.id);
            }
        });
    });

    describe('When the it is 6am in the UTC timezone', () => {
        const LAMBDA_PRINCIPAL_SERVICE = 'events.amazonaws.com';
        const EXPECTED_SCHEDULE_EXPRESSION = 'cron(0 6 * * ? *)';
        it('The Lambda Should be executed', async () => {
            const lambdaPolicy = await findTriggerSourceArn(lambdaArn, REGION, LAMBDA_PRINCIPAL_SERVICE);
            const scheduleExpression = await getCloudWatchEventRuleScheduleExpression(lambdaPolicy, REGION);
            expect(scheduleExpression).to.equal(EXPECTED_SCHEDULE_EXPRESSION)
        });
    });
});