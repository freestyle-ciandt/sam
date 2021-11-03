const fs = require('fs');
const { S3 } = require('aws-sdk');

const s3 = new S3();

const uploadFile = async (bucketName, objectName, fileToUpload) => {
    try {
        const fileToUploadBuffer = fs.readFileSync(fileToUpload);
        await s3.putObject({
            Bucket: bucketName,
            Key: objectName,
            Body: fileToUploadBuffer,
        }).promise();
    } catch (e) {
        console.log('Unable to upload file to S3 Bucket', { e });
    }
};

module.exports = {
    uploadFile,
}