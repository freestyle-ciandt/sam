# Introdução
O objetivo desse exercício é o de criar uma Lambda Function que colete dados de um SQS Queue.

## Requisitos
(TODO)

## Links úteis
AWS Serverless API: https://github.com/aws/serverless-application-model/blob/master/docs/internals/generated_resources.rst#api
AWS Serverless Function: https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
AWS Serverless Function API Event Source: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
AWS SAM Policy Templates: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html


## Validação do exercício

Crie um arquivo *.env* dentro do diretório atual com o seguinte conteúdo:
```
API_KEY='Coloque aqui a API Key da sua aplicação'
API_URL='Coloque aqui a URL da sua API'
```

Em seguida, no diretório raiz do projeto, execute o seguinte script para validar o exercício:
```
npm run validate -ex=04
```
