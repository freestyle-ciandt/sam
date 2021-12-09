# Introdução
O objetivo desse exercício é criar uma Lambda function que seja invocada por meio de uma API HTTP, fazendo uso do [Framework AWS SAM](https://aws.amazon.com/serverless/sam/).

## Requisitos

- A API deve:
  - Responder a uma requisição GET no caminho */exercise-01* com status 200
  - Ser protegida por uma API Key
  - Retornar o seguinte payload JSON quando invocada:
```
{
    "message": "This is the solution for exercise 01"
}
```
- Crie seu template SAM no seguinte caminho: **sam/exercises/template.yaml**
- Nomeie sua Lambda function **Exercise-01-function**

## Links úteis
AWS Serverless API: https://github.com/aws/serverless-application-model/blob/master/docs/internals/generated_resources.rst#api
AWS Serverless Function: https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
AWS Serverless Function API Event Source: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
AWS Serverless API key example: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-controlling-access-to-apis-keys.html
AWS Serverless API ApiAuth Usage plans: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-apiauth.html#sam-api-apiauth-usageplan

## Validação do exercício

Crie um arquivo *.env* dentro da raíz do projeto com o seguinte conteúdo:

```
API_KEY='Coloque aqui a API Key da sua aplicação'
API_URL='Coloque aqui a URL da sua API'
```

E execute o seguinte comando: `npm run validate -ex=01`.