const {
    CloudFormation,
} = require('aws-sdk');

const cfn = new CloudFormation({
    region: process.env.REGION,
});

const getStackOutputs = async (stackName) => {
    try {
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

module.exports = {
    getStackOutputs,
}