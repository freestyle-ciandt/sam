const {
    CloudWatchEvents,
} = require('aws-sdk');

const cloudwatchevevent = new CloudWatchEvents({
    region: process.env.REGION,
});

const getRuleScheduleExpression = async (cloudWatchEventArn) => {
    try {
        const eventName = cloudWatchEventArn.substring(cloudWatchEventArn.lastIndexOf('/') + 1);
        const { ScheduleExpression: scheduleExpression } = await cloudwatchevevent.describeRule({
            Name: eventName,
        }).promise();
        return scheduleExpression;
    } catch (e) {
        console.log(`Unable to find schedule for CloudWatch event ${cloudWatchEventArn}`, { e });
    }
};

module.exports = {
    getRuleScheduleExpression,
};