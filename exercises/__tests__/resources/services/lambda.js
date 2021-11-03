const { Lambda } = require('aws-sdk');

const lambda = new Lambda({
    region: process.env.REGION,
});

const invoke = async (lambdaArn) => {
    try {
        await lambda.invoke({
            FunctionName: lambdaArn,
            InvocationType: 'RequestResponse',
        }).promise();
    } catch (e) {
        console.log(`Unable to invoke Lambda function ${lambdaArn}`, { e });
    }
};

const findTriggerByServicePrincipal = async (lambdaArn, servicePrincipal) => {
    try {
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

module.exports = {
    invoke,
    findTriggerByServicePrincipal,
}
