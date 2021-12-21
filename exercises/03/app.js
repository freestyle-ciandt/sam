import { parse } from 'csv-parse/sync';

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });


exports.handlerProduto = async (event) => {
    console.log('process.env.BucketName= ', process.env.BucketName)

    var bucketParams = {
        Bucket: process.env.BucketName,
        Key: 'produtos.csv'
    };


    try {
        const products = await s3.getObject(bucketParams).promise()
        console.log("Success", products);
        console.log("Success", products.Body);

    } catch (error) {
        console.log("Error", error);
    }


    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'TOP',
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
}