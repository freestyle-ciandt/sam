const chai = require("chai");

const cloudformation = require("../../../__tests__/resources/services/cloudformation");
const s3 = require("../../../__tests__/resources/services/s3");
const lambda = require("../../../__tests__/resources/services/lambda");
const dynamodb = require("../../../__tests__/resources/services/dynamodb");
const cloudwatch = require("../../../__tests__/resources/services/cloudwatch");

const csv = require("../../../__tests__/resources/services/csv");

const { expect } = chai;

const { STACK_NAME } = process.env;

const PRODUCTS_FILE_NAME = "produtos.csv";
const PRODUCTS_CSV = `${process.cwd()}/exercises/03/tests/int/resources/${PRODUCTS_FILE_NAME}`;

describe("Given a S3 bucket", () => {
  let bucketName;
  let lambdaArn;
  let tableName;

  before(async () => {
    ({
      BucketName: bucketName,
      LambdaArn: lambdaArn,
      TableName: tableName,
    } = await cloudformation.getStackOutputs(STACK_NAME));
  });

  describe("When a new version of products.csv is inserted and the lambda event is called", () => {
    let records;

    before(async () => {
      await s3.uploadFile(bucketName, PRODUCTS_FILE_NAME, PRODUCTS_CSV);
      await lambda.invoke(lambdaArn);
      records = csv.toObject(PRODUCTS_CSV);
    });

    it("Then it should contain all records in the DynamoDB", async () => {
      for (const record of records) {
        const dynamoDBItem = await dynamodb.get(tableName, {
          id: record.id,
        });
        expect(dynamoDBItem).to.be.eql(record);
      }
    });

    after(async () => {
      for (const record of records) {
        await dynamodb.remove(tableName, {
          id: record.id,
        });
      }
    });
  });

  describe("When it is 6am in the UTC timezone", () => {
    const LAMBDA_PRINCIPAL_SERVICE = "events.amazonaws.com";
    const EXPECTED_SCHEDULE_EXPRESSION = "cron(0 6 * * ? *)";
    it("The Lambda Should be executed", async () => {
      const lambdaPolicy = await lambda.findTriggerByServicePrincipal(
        lambdaArn,
        LAMBDA_PRINCIPAL_SERVICE
      );
      const scheduleExpression = await cloudwatch.getRuleScheduleExpression(
        lambdaPolicy
      );
      expect(scheduleExpression).to.equal(EXPECTED_SCHEDULE_EXPRESSION);
    });
  });
});
