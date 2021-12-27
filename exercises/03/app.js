const parse = require('csv-parse/lib/sync');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const { TableName } = process.env

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// const writeItems = (batchSize, items) => {
//     const docClient = new AWS.DynamoDB.DocumentClient();

//     while (dynamoActions.length) {
//         const params = {
//             RequestItems: {
//             }
//         };

//         params.RequestItems[TableName] = dynamoActions.splice(0, batchSize)

//         const writeResponse = await docClient.batchWrite(params).promise()

//         console.log('writeResponse.UnprocessedItems: ', writeResponse.UnprocessedItems)
//     }
// }

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
        
        let itensToWrite = []

        while (dynamoActions.length) {
            const params = {
                RequestItems: {
                }
            };

            params.RequestItems[TableName] = dynamoActions.splice(0, 25)

            itensToWrite.push(docClient.batchWrite(params).promise())
        }

        const itensProcessed = await Promise.all(itensToWrite)
        console.log('itensProcessed(last 10): ', itensProcessed.splice(-10, 10))

        itensToWrite = []

        itensProcessed.forEach(item => {
            if (item.UnprocessedItems[TableName]) {
                const params = {}
                params.RequestItems = item.UnprocessedItems
                itensToWrite.push(docClient.batchWrite(params).promise())
            }
        })
        
        const itensReProcessed = await Promise.all(itensToWrite)
        console.log('itens RE-Processed: ', itensReProcessed)
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