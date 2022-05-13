const AWS = require('aws-sdk')
const jose = require('jose')

const { DynamoDB } = AWS
const { AliasesTableName } = process.env

const docClient = new DynamoDB.DocumentClient()

const getId = () => { 
    return Date.now().toString(36)
}

const saveShortUrl = async (url, uuid, groups, maxTries) => {
    const id = getId();
    // const id = 'l2kmkpye';

    const params = {
        TableName: AliasesTableName,
        Key: { id },
        UpdateExpression: 'set #prevUrl=:url, #prevUuid=:uuid, #prevTipo=:tipo',
        ConditionExpression: '#prevId <> :id',
        ExpressionAttributeNames: {
            '#prevId': 'id',
            '#prevUrl': 'url',
            '#prevUuid': 'uuid',
            '#prevTipo': 'tipo'
        },
        ExpressionAttributeValues: {
            ':id' : id, // mudar para newId e criar um ExpressionAttributeNames para o id '#id': 'id',
            ':url' : url,
            ':uuid' : uuid,
            ':tipo' : groups
        }
    }

    try {
        console.log('saveShortUrl try')
        return await docClient.update(params).promise();
    } catch (error) {
        console.log('saveShortUrl catch:', error)
        if (error.code === 'ConditionalCheckFailedException') {
            maxTries--;

            if (maxTries <= 0) {
                console.log('Max tries reached!')
                throw error;  
            }

            console.log('Trying to save with other ID!')
            return await saveShortUrl(url, uuid, groups, maxTries)
        }
    }
}

exports.handler = async event => {
    console.log('createAliasFunction', event)

    const { url } = JSON.parse(event.body).data
    const idToken = event.headers.Authorization

    const claims = jose.decodeJwt(idToken)
    
    
    const {
        email_verified: emailVerified,
        'cognito:groups': cognitoGroups,
        sub: uuid
    } = claims

    console.log('claims', claims)

    if (!emailVerified) {
        return {
            body: JSON.stringify({
                status: 'Error',
                message: 'User not verified.'
            })
        }
    }

    if (!cognitoGroups || !cognitoGroups.length) {
        return {
            body: JSON.stringify({
                status: 'Error',
                message: 'Use has no group.'
            })
        }
    }

    const body = {};

    try {
        await saveShortUrl(url, uuid, cognitoGroups.join(), 2)
        body.status = 'Success';
    } catch(error) {
        console.log('handler: saveShortUrl error', error)
        body.status = 'Error';
        body.error = error;
    }

    return {
        body: JSON.stringify(body)
    }
}