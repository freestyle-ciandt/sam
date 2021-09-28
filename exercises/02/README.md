# Introdução
O objetivo desse exercício é o de criar uma Lambda Function que possua um evento http e que retorne dados do DynamoDB.

## Requisitos
- criar uma tabela DynamoDB com as seguintes especificações:
  - O nome da tabela deverá ser "<<seu_nome>>-clientes".
  - a tabela deverá possuir a capacidade de ler e de escrever 3 vezes por segundo.
  - a tabela deverá ter uma partition key **id**.
  - a tabela deverá ter um global secondary index **cidade-index** com o atributo **cidade** como chave de partição.
  - o payload um item dessa tabela deverá se parecer com o abaixo:

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
  - Responder a uma requisição GET no caminho */exercise-02/{id}*.
    - essa API pegará o valor de {id} e realizará uma operação de **getItem** na tabela de clientes.
    - se o valor existir, a API deverá retornar o status 200 e os dados do cliente encontrado.
    - se o valor não existir, a API deverá retornar o status 403 com a mensagem "Cliente não encontrado".
  - Responder a uma requisição GET no caminho */exercise-02/{cidade}*
    - essa API pegará o valor de {cidade} e realizará uma operação de **query** no índice pela chave secundária **cidade-index**.
    - a API deverá retornar uma lista de objetos com todos clientes que possuem a cidade informada pela requisição. Por exemplo:

```json
[
    {
        "id": 1,
        "nome": "Cliente 1",
        "documento": "123456789",
        "cidade": "Rio de Janeiro",
        "estado": "RJ",
        "pais": "Brasil",
        "id_plano": 10
    },
    {
        "id": 2,
        "nome": "Cliente 2",
        "documento": "987654321",
        "cidade": "Rio de Janeiro",
        "estado": "RJ",
        "pais": "Brasil",
        "id_plano": 5
    }
]
```
    - se nenhum valor existir, a API deverá retornar uma lista vazia com o status 200.
  - A API deve ser protegida com uma API KEY e retornar o erro 403 se está for inválida.

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
TABELA_CLIENTE='Coloque aqui o nome da tabela criada'
```

Em seguida, no diretório raiz do projeto, execute o seguinte script para validar o exercício:
```
npm run validate -ex=02
```
