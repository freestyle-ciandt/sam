# Introdução
O objetivo desse exercício é o de criar uma arquitetura Produtor-Consumidor usando o SQS Queue e Lambda Functions.

## Requisitos

- Criar uma API com as seguintes especificações:
  - responder uma requisição POST no caminho **/clientes**.
  - receber um JSON no seguinte formato:

```json
{
    "id": "<inteiro>",
    "nome": "<string>",
    "documento": "<string>",
    "cidade": "<string>",
    "estado": "<string>",
    "pais": "<string>",
    "id_plano": "<inteiro>"
}
```

  - ser protegida por uma API KEY.
  - validar o **body** da requisição:
    - Se algum campo não for enviado, ela deverá retornar o erro **400 (Bad Request)**.
    - Se o tipo de algum campo estiver incorreto, retornar o erro **400 (Bad Request)**.
    - Se a requisição estiver correta, enviar o JSON para uma fila de SQS e retornar o código HTTP **200 (Sucesso)** para o cliente.

- criar uma Lambda Function que:
  - leia as mensagens da fila de SQS
  - salve as mensagens da fila na tabela de DynamoDB criada no [exercício 2](../02/README.md)

## Links úteis
* **AWS Serverless API:** https://github.com/aws/serverless-application-model/blob/master/docs/internals/generated_resources.rst#api
* **AWS Serverless Function:** https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
* **AWS Serverless Function API Event Source:** https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
* **AWS SAM Policy Templates:** https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html
* **Exemplo de use de path parameter:** https://aws.amazon.com/blogs/compute/introducing-simplified-serverless-application-deplyoment-and-management/
* **AWS SQS Queue:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html
* **Envio de mensagens para uma fila SQS usando o AWS SDK**: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
* **Event Source Mapping de SQS para Lambdas Consumidoras:** https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-sqs.html
* **Escrevendo em tabelas DynamoDB:** https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html

## Validação do exercício

Crie um arquivo *.env* dentro do diretório atual com o seguinte conteúdo:
```
(TODO)
```

Em seguida, no diretório raiz do projeto, execute o seguinte script para validar o exercício:
```
npm run validate -ex=04
```
