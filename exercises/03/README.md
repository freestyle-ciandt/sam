# Introdução
O objetivo desse exercício é o de criar uma Lambda Function que seja chamada pelo Cloud Watch Event.

## Requisitos
- a infraestrutura deverá processar um arquivo CSV com as seguintes colunas:
  - id: **string**
  - product_name: **string**
  - description: **string**
  - price: **string**
- esse arquivo será sempre gerado em um Bucket S3. Para esse exercício, voce deverá chamá-lo de `<nome-da-sua-stack-de-cloudformation>-produtos`.
- você pode utilizar o [arquivo auto gerado para esse exercício](produtos.csv) para testar seu código.
- seu trabalho será criar um evento de **CloudWatch** que executa todo os dias às 6 horas no horário UTC. Esse evento deverá chamar uma **Lambda Function** que:
  - procura o arquivo **produtos.csv** dentro no Bucket S3 criado anteriormente.
  - escreve os itens desse CSV em uma tabela **DynamoDB** `<nome-da-sua-stack-de-cloudformation>-produtos`. Essa tabela deverá possuir o tipo de custo **ON DEMAND**.
  - os itens deverão ser escritos com o uso da operação **batchWriteItem** com **25 items** de cada vez.
  - caso algum item falhe, você deverá tentar escrevê-lo novamente.
- você deverá colocar o **nome do bucket S3** e o **ARN de sua Lambda** como **Outputs** do seu template de CloudFormation. Eles serão usados pelos testes integrados. Os outputs deverão ser:
  - **BucketName** para o nome do Bucket S3.
  - **LambdaArn** para o ARN da Lambda Function.
  - **TableName** para o nome de sua tabela de DynamoDB.

## Links úteis
**Definições do tipo AWS::S3::Bucket:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html

**Definições do tipo AWS::DynamoDB::Table:** https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html

**Definindo DynamoDB como ON_DEMAND:** https://intellipaat.com/community/17613/how-to-set-dynamodb-read-write-capacity-mode-to-on-demand-on-cloudformation

**Usando o writeBatchItems no NodeJS:** https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write-batch.html

**Exemplo de uso do writeBatchItem:** https://gist.github.com/crizant/48de514d9e5f43b252bad10e6a81734b

**Parser de CSV:** https://csv.js.org/parse/

**CloudFormation Outputs:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html

## Validação do exercício

Crie um arquivo *.env* dentro da raíz do projeto com o seguinte conteúdo:

```
STACK_NAME=<<nome_da_sua_stack_aqui>>
REGION=<<região da AWS onde esta sua Stack de CloudFormation>>
```

E execute o seguinte comando: `npm run validate -ex=03`.