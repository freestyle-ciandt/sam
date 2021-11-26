# Introdução
O objetivo desse repositório é estabelecer alguns exercícios básicos de arquitetura Serverless na AWS os quais devem ser resolvidos com o uso do [Framework AWS SAM](https://aws.amazon.com/serverless/sam/). O repositório possuirá todas as respostas, porém o usuário deste repositório deverá tentar resolver os exercícios listados antes de olhar as soluções.

## Antes de começar
Garanta que máquina está pronta para você começar os exercícios com [este tutorial](exercises/README.md).
## Exercícios
|Exercícios|Enunciado|
|-|-|
|[Exercício 0](exercises/00/README.md)|introduzir o estudante a conceitos básicos de YAML, CloudFormation e SAM antes de começar o exercício|
|[Exercício 1](exercises/01/README.md)|criar uma Lambda function que seja invocada por meio de uma API HTTP, fazendo uso do [Framework AWS SAM](https://aws.amazon.com/serverless/sam/)|
|[Exercício 2](exercises/02/README.md)|criar uma Lambda Function que possua um evento http e que retorne (GetItem) algum dado de uma Tabela do DynamoDB|
|[Exercício 3](exercises/03/README.md)|criar uma Lambda Function que seja chamada a cada uma hora (Cloud Watch Event)|
|[Exercício 4](exercises/04/README.md)|criar uma integração entre Lambda Functions e o SQS Queue|
|[Exercício 5](exercises/05/README.md)|criar uma Lambda Layer que crie grupos de log e as aplique nas funções criadas nos exercícios anteriores|
## Licença
[Link da licença deste repositório](./LICENSE)