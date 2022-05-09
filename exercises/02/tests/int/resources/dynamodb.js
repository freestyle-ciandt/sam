const { DynamoDB } = require("aws-sdk");
const clientes = require("./clients.json");

const { TABELA_DE_CLIENTES, AWS_REGION } = process.env;

const docClient = new DynamoDB.DocumentClient({ region: AWS_REGION });

const populateTable = async () =>
  Promise.all(
    clientes.map(async (cliente) => {
      await docClient
        .put({
          TableName: TABELA_DE_CLIENTES,
          Item: cliente,
        })
        .promise();
    })
  );

const deleteItems = async () =>
  Promise.all(
    clientes.map(async (cliente) => {
      await docClient
        .delete({
          TableName: TABELA_DE_CLIENTES,
          Key: {
            id: cliente.id,
          },
        })
        .promise();
    })
  );

module.exports = {
  populateTable,
  deleteItems,
};
