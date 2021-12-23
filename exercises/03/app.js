const parse = require('csv-parse/lib/sync');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const { TableName } = process.env

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });




exports.handlerProduto = async (event) => {
    console.log('process.env.BucketName= ', process.env.BucketName)

    var bucketParams = {
        Bucket: process.env.BucketName,
        Key: 'produtos.csv'
    };



    try {
        const products = await s3.getObject(bucketParams).promise()
        let csv = products.Body.toString('utf-8')

        const csvParsed = parse(csv, {
            columns: true,
            skip_empty_lines: true
        });
        console.log('csv parsed', csvParsed)

        const dynamoActions = csvParsed.map((item) => {
            return {
                PutRequest: {
                    Item: item
                }
            }
        })

        const docClient = new AWS.DynamoDB.DocumentClient();

        while (dynamoActions.length) {
            const params = {
                RequestItems: {
                }
            };

            params.RequestItems[TableName] = dynamoActions.splice(0, 25)


            await docClient.batchWrite(params).promise()
        }

        // 1. separar itens em grupos de 25
        // 2. adequar o json ao formato do RequestItems (l. 31)
        // 3. chamar batchWriteItem


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