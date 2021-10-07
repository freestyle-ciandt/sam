# Introdução
O objetivo desse exercício é o de introduzir o usuário desse repositório ao AWS SAM com um exemplo mais básico. Se você já possui algum conhecimento sobre esse framework, você pode pular para o [exercício 01](../01/README.md).

## Requisitos
* Realizar os passos mencionados em **Configurando sua máquina** conforme citado na pasta de [exercícios](../README.md).
* conhecer a linguagem YAML. Caso não conheça, veja [a sessão YAML](#aprenda-yaml).
* conhecer sobre o AWS CloudFormation. Caso não conheça, veja [a sessão CloudFormation](#aprenda-cloudformation).
* conhecer sobre o AWS SAM. Caso não conheça, veja [a sessão SAM (Serverless Application Model)](#sam-serverless-application-model).


## Antes de começar (para iniciantes)
### Aprenda YAML
O arquivo [template.yaml](../template.yaml) - que será utilizado nos próximos exercícios - utiliza uma linguagem de serialização de dados amigável para humanos denominada [YAML](https://yaml.org/). Caso você não tenha trabalhado com essa linguagem, você pode acessar os links abaixo para estudá-la antes de continuar:

* [Introdução básica ao YAML para Ansiosos](https://miyake-akio.medium.com/introdu%C3%A7%C3%A3o-b%C3%A1sica-ao-yaml-para-ansiosos-2ac4f91a4443)
* [Aprenda YAML](https://learnxinyminutes.com/docs/pt-br/yaml-pt/)
* [Site Oficial do YAML](https://yaml.org/)

### Aprenda CloudFormation
Ao analisar o arquivo [template.yaml](../template.yaml), você pode notar que este está escrito na linguagem YAML. Este arquivo possui a estrutura básica de template CloudFormation, que é uma ferramenta de Infraestrutura como Código (IaC). Ferramentas que IaC são utilizadas para que uma pessoa possa definir sua infraestrutura a partir de um código. No caso do CloudFormation, a ferramenta utiliza de linguagens de serialização já conhecidas como o **JSON** e o **YAML** para que um dado desenvolvedor possa declarar seus recursos de infraestrutura e os criar a partir deste arquivo. Caso possua interesse em aprender mais sobre o CloudFormation, você pode acessar os links abaixo:

#### Documentos
* [O que é o AWS CloudFormation?](https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/Welcome.html)
* [Conceitos Básicos](https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/GettingStarted.Walkthrough.html#GettingStarted.Walkthrough.viewapp)
* [Anatomia do Modelo](https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/template-anatomy.html)
* [Introdução ao CloudFormation](https://www.clouddog.com.br/blog/introducao-ao-aws-cloudformation/)
* [AWS CloudFormation Declarative Infrastructure Code Tutorial](https://blog.boltops.com/2018/02/14/aws-cloudformation-declarative-infrastructure-code-tutorial)
#### Vídeos
* [Introdução ao CloudFormation](https://www.youtube.com/watch?v=xfiW3u4vR7U)
* [Criando uma instância EC2 na AWS](https://www.youtube.com/watch?v=OFDvN1b049A)
* [AWS CloudFormation Template Tutorial](https://www.youtube.com/watch?v=_jqwVpO1w6A)
* [How to Code Any AWS CloudFormation | Step By Step Coding](https://www.youtube.com/watch?v=WlPokWf4VoM)

## SAM (Serverless Application Model)
O SAM (Servesless Application Model) é um framework de código-aberto criado pela AWS e que será utilizado para a resolução dos exercícios deste repositório. Ele permite a expansão da sintaxe padrão do CloudFormation para facilitar a criação de recursos serverless.
O documento [Antes de começar](../README.md) possui o guia de como instalar o **AWS SAM CLI** em sua máquina para que você possa utilizá-la para realizar o deployment de sua aplicação.
Para saber mais sobre o AWS SAM, você pode ler as seguintes documentações:

#### Documentos
* [O que é o SAM?](https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/what-is-sam.html)
* [Tutorial: Implantar um aplicativo Hello World](https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html)
* [AWS SAM Anatomia do modelo](https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/sam-specification-template-anatomy.html)
* [AWS SAM Referência de Propriedades e Recursos](https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/sam-specification-resources-and-properties.html)

#### Vídeos
* [AWS SAM Tutorial](https://www.youtube.com/watch?v=MipjLaTp5nA)
* [Getting Started with AWS SAM](https://www.youtube.com/watch?v=k_TQubcn0hM)

## Exercícios
### Exercício 1:
Explique a estrutura do arquivo [template.yaml](./../template.yaml).

#### Solução do exercício
Ao abrir o arquivo [template.yaml](../template.yaml), você pode ver o seguinte conteúdo:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: 'AWS::Serverless-2016-10-31'

Description: Template básico para você resolver seus exercícios

Resources:
  RecursoInutil:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: bucket-s3-de-exemplo

Outputs:
  RecursoInutil:
    Description: Saída criada de exemplo
    Value: !Ref RecursoInutil
```

* `AWSTemplateFormatVersion: '2010-09-09'`: essa linha declara a versão do template que você deseja utilizar. Você pode encontrar mais sobre esta [neste link](https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/format-version-structure.html).
* `Transform: 'AWS::Serverless-2016-10-31'`: são os macros que a ferramenta AWS CloudFormation deverá processar antes de rodar seu template. Neste caso, a operação está chamando o macro `AWS::Serverless-2016-10-31'` que é referente ao [AWS SAM](https://github.com/aws/serverless-application-model). O AWS SAM possibilita o uso de outros recursos que não são suportados por padrão pelo CloudFormation. Você pode encontrar mais sobre a operação transform [neste link](https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/transform-section-structure.html).
* `Description`: é a descrição do template. Ela aparecerá no Console do CloudFormation após a Stack ser executada.
* `Resources`: inicia a declaração dos recursos que você deseja criar em sua conta AWS. Mais sobre resources [neste link](https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/resources-section-structure.html).
* `RecursoInutil`: ID lógico do recurso. Toda vez que você for referenciar alguma coisa relacionada a este recurso, você utilizará este valor.
* `Type`: o tipo de recurso a ser criado. Neste caso o template está declarando um recurso do tipo `AWS::S3::Bucket`, que é um Bucket S3. Você pode encontrar a lista de recursos da AWS [aqui](https://docs.aws.amazon.com/en_us/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html).
* `Properties`: são as configurações do recurso que será criado.
* `BucketName`: é o nome do Bucket S3. Você pode achar todas as configurações deste recurso [aqui](https://docs.aws.amazon.com/en_us/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html).
* `Outputs`: declaração de valores de saída deste template.
* `RecursoInutil`: nome lógico do recurso.
* `Description`: descrição do valor de saída.
* `Value`: valor de saída. Neste caso, ele mostrará o nome do Resource **RecursoInutil**. Você pode ver isso na [documentação oficial do tipo AWS::S3::Bucket](https://docs.aws.amazon.com/en_us/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#aws-properties-s3-bucket-return-values).


### Exercício 2
Siga o tutorial [Tutorial: Implantar um aplicativo Hello World](https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html) da AWS.
Caso não consiga

#### Solução do exercício
Essa solução serve mais para caso você tenha se perdido em alguns dos passos do tutorial da AWS.

1. Crie sua conta da AWS. Caso não tenha criado, veja [esse link](https://aws.amazon.com/pt/premiumsupport/knowledge-center/create-and-activate-aws-account/).
2. Crie credenciais da AWS para executar comandos em sua máquina. Veja [esse link](https://docs.aws.amazon.com/pt_br/powershell/latest/userguide/pstools-appendix-sign-up.html).
3. Crie o arquivo `~/.aws/credentials` e coloque o seguinte conteúdo nele:

```
[sam_dojo]
aws_access_key_id = << ID de chave de acesso >>
aws_secret_access_key = << Chave de acesso secreta >>
region = us-east-1
```

4. Em um terminal, rode `export AWS_PROFILE=sam_dojo`.
5. Crie uma pasta chamada `sam_dojo`.
6. Dentro desta pasta, rode o comando `sam init`.
   1. Para a pergunta `Which template source would you like to use?`, escolha 1 (AWS Quick Start Templates).
   2. Para a pergunta `Which runtime would you like to use?`, escolha 1 (nodejs12.x).
   3. Para a pergunta `Project name`, digite `hello-world`.
   4.  Para a pergunta `AWS quick start application templates:`, escolha 1 (Hello World Example).
7.  Entre na pasta `hello-world` criada pelo script
8.  Crie seu aplicativo com `sam build`.
9.  Deploy seu aplicativo usando `sam deploy --guided`.
    1.  Para a **StackName**, dê o nome `<<seu_nome>>-hello-world>>`.
    2.  Para **region**, aperte **ENTER** para deixa o valor padrão (us-east-1).
    3.  Para `Confirm changes before deploy`, digite `y` e clique **ENTER**.
    4.  Para `Allow SAM CLI IAM role creation`, clique **ENTER** para aceitar.
    5.  Para `HelloWorldFunction may not have authorization defined, Is this okay?`, digite `y` para aceitar.
    6.  Para `Save arguments to samconfig.toml`, clique **ENTER** para aceitar.
10. Espero a stack terminar. Vocè verá a mensagem `Successfully created/updated stack - <<seu_nome>>-hello-world>> in us-east-1`
11. Na saída da execução, você verá uma saída chamada `HelloWorldApi`, pegue o valor dela e teste a execução da stack usando o comando **curl**. O valor será algo similar a `https://<restapiid>.execute-api.us-east-1.amazonaws.com/Prod/hello/`:

```sh
curl https://<restapiid>.execute-api.us-east-1.amazonaws.com/Prod/hello/
```

A resposta do comando deverá ser:

```json
{
  "message": "hello world"
}
```

1.  Vá para o console do [CloudFormation](https://console.aws.amazon.com/cloudformation/home).
2.  Selecione o menu **Stacks**.
3.  Procure a stack com o nome **<<seu_nome>>-hello-world**.
4.  Selecione a stack.
5.  Clique no botão **Deletar**.
6.  Confirme a deleção da stack.