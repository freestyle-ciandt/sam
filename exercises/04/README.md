# Introdução
O objetivo desse exercício é o de criar uma arquitetura Produtor-Consumidor usando o SQS Queue e Lambda Functions.

## Requisitos

- Atualizar a API criada no [exercício 2](../02/README.md) com as seguintes especificações:
  - responder uma requisição **POST** no caminho */exercise-04*.
  - receber um JSON no seguinte formato:

```json
{
    "id": 1,
    "nome": "Nome do Cliente",
    "documento": "123456789",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "pais": "Brasil",
    "id_plano": 10
}
```
  - A API deve:
    - retornar **o código 403 (Forbidden)** caso a API KEY não seja informada na requisição.
    - validar o body da requisição para:
      - garantir que todos os campos estão sendo enviados no corpo da requisição.
      - garantir que o tipo do campo enviado esteja correto.
      - garantir que os campos inteiros não sejam igual a 0 (id e id_plano).
      - garantir que os campos string não sejam vazios (nome, documento, cidade, estado e pais).
    - se a requisição estiver inválida, a API deve retornar **o código 400 (Bad Request)** com a seguinte mensagem:


        ```json
        {
            "message": "Invalid Input"
        }
        ```

    - Se a requisição estiver correta, enviar o JSON para uma fila de SQS e retornar o código HTTP **200 (Sucesso)** para o cliente:

        ```json
        {
            "message": "Success"
        }
        ```

  - A fila de SQS deverá possui uma Lambda que leia suas mensagens e que a salve dentro da tabela de DynamoDB criada [exercício 2](../02/README.md).

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

Crie um arquivo *.env* dentro da raíz do projeto com o seguinte conteúdo:

```
API_KEY='Coloque aqui a API Key da sua aplicação'
API_URL='Coloque aqui a URL da sua API'
TABELA_DE_CLIENTES='Coloque aqui o nome da tabela criada'
AWS_REGION='coloque aqui em que região seu DynamoDB está'
```

E execute o seguinte comando: `npm run validate -ex=04`.