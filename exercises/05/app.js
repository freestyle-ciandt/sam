const AWS = require('aws-sdk')
const jose = require('jose')

const { DynamoDB, CognitoIdentityServiceProvider } = AWS
const { AliasesTableName } = process.env

const docClient = new DynamoDB.DocumentClient()

const getId = () => { 
    return Date.now().toString(36)
}

exports.handler = async event => {
    console.log('createAliasFunction', event)
    
    const { url } = JSON.parse(event.body).data
    const idToken = event.headers.Authorization

    const claims = jose.decodeJwt(idToken)
    console.log('claims', claims)

    // Os dados estão sendo salvos no DB, porem não testei se está sobrescrevendo IDs existentes e o ConditionExpression: 'id <> :oldId' parece estar errado -> :newId <> :oldId
    // O decode das informações contidas no Token está sendo feita para obter os dados do usuário
    // Outra opção para geração de hashs:
    //  https://stackoverflow.com/a/16110130/1723912
    //  https://www.npmjs.com/package/hashids
    //  var hashids = new Hashids(<url>, length:8)
    //  console.log(hashids.encode(1))

    const id = getId()
    const params = {
        TableName: AliasesTableName,
        Key: { id },
        UpdateExpression: 'set #url=:url, #uuid=:uuid, #tipo=:tipo',
        ConditionExpression: 'id <> :oldId',
        ExpressionAttributeNames: {
            '#url': 'url',
            '#uuid': 'uuid',
            '#tipo': 'tipo'
        },
        ExpressionAttributeValues: {
            ':oldId' : id, // mudar para newId e criar um ExpressionAttributeNames para o id '#id': 'id',
            ':url' : url,
            ':uuid' : 'to-do uuid',
            ':tipo' : 'to-do tipo'
        }
    }

    try {
        const response = await docClient.update(params).promise()
        console.log('DDB Update Response:', response)
    } catch (error) {
        console.log(error)
    }

    return {
        body: JSON.stringify({status: 'It is alive!'})
    }
}