# Introdução
O objetivo desse exercício é o de criar uma Lambda Function que possua um evento http e que retorne (GetItem) algum dado de uma Tabela do DynamoDB.

## Requisitos
(TODO)

## Links úteis
AWS Serverless API: https://github.com/aws/serverless-application-model/blob/master/docs/internals/generated_resources.rst#api
AWS Serverless Function: https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
AWS Serverless Function API Event Source: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
AWS SAM Policy Templates: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html
Criando Tabela DynamoDB pelo CloudFormation: https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html

## Validação do exercício

Crie um arquivo *.env* dentro do diretório atual com o seguinte conteúdo:
```
API_KEY='Coloque aqui a API Key da sua aplicação'
API_URL='Coloque aqui a URL da sua API'
```

Em seguida, no diretório raiz do projeto, execute o seguinte script para validar o exercício:
```
npm run validate -ex=02
```
