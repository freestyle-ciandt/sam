const parse = require('csv-parse/lib/sync');
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
        let csv = products.Body.toString('utf-8')

        const csvParsed = parse(csv, {
            columns: true,
            skip_empty_lines: true
          });
        console.log('csv parsed', csvParsed)

//         var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// var params = {
//   RequestItems: {
//     "TABLE_NAME": [
//        {
//          PutRequest: {
//            Item: {
//              "KEY": { "N": "KEY_VALUE" },
//                "ATTRIBUTE_1": { "S": "ATTRIBUTE_1_VALUE" },
//                "ATTRIBUTE_2": { "N": "ATTRIBUTE_2_VALUE" }
//            }
//          }
//        }
//     ]
//   }
// };

// ddb.batchWriteItem(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data);
//   }
// });
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