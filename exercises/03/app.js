const parse = require('csv-parse/lib/sync');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const { TableName } = process.env

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const docClient = new AWS.DynamoDB.DocumentClient();

const writeItems = (items, batchSize) => {
    let writeRequests = []

    console.log('Total Rows: ', items.length)
    while (items.length) {
        const params = {
            RequestItems: {}
        };

        
        params.RequestItems[TableName] = items.splice(0, batchSize)
        
        console.log('Batch:', params.RequestItems[TableName])

        writeRequests.push(docClient.batchWrite(params).promise())
    }

    return Promise.all(writeRequests)
}

const unprocessedItemsReducer = (previousBatch, currentBatch) => {
    const unprocessedItems = currentBatch.UnprocessedItems[TableName]
    if(unprocessedItems) {
        previousBatch = previousBatch.concat(unprocessedItems)
    }
    
    return previousBatch
}

exports.handlerProduto = async (event) => {
    console.log('process.env.BucketName= ', process.env.BucketName)

    let bucketParams = {
        Bucket: process.env.BucketName,
        Key: event.bucketFileKey || 'produtos.csv'
    }
    
    console.log('event', event)
    console.log('bucketParams', bucketParams)

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

        const batchWriteStatus = await writeItems(dynamoActions, 25)
        console.log('last 10 items: ', batchWriteStatus.slice(-10))
        const unprocessedItems = batchWriteStatus.reduce(unprocessedItemsReducer, [])
        console.log('All unprocessedItems from First batch write attempt: ', unprocessedItems)

        const batchWriteRetryStatus = await writeItems(unprocessedItems, 25)
        console.log('last 10 items: ', batchWriteStatus.slice(-10))
        const unprocessedItemsRetry = batchWriteRetryStatus.reduce(unprocessedItemsReducer, [])
        console.log('All unprocessedItems from Second batch write attempt: ', unprocessedItemsRetry)

        /*

        UnprocessedItems: {
            RequestItems: {
                <TableName>: [
                    {
                        PutRequest: {
                            Item: <row>
                        }
                    }
                ]
            }
        }

        */
    } catch (error) {
        console.log("Error", error);
    }
}