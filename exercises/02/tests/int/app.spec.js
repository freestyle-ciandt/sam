const chai = require("chai");
const chaiHttp = require("chai-http");

const { populateTable, deleteItems } = require("./resources/dynamodb");

chai.use(chaiHttp);

const { expect, request } = chai;

const { API_KEY, API_URL } = process.env;

// This is the path for the endpoint to be tested
const API_PATH = "/exercise-02";

const ID_PAYLOAD = require("./resources/id.json");
const CITY_PAYLOAD = require("./resources/city.json");

let response;
describe(`Given the API receives a GET request on path: ${API_PATH}/{id}`, () => {
  const id = 30;

  before(async () => {
    await populateTable();
  });

  describe("When the API Key is provided", () => {
    before(async () => {
      response = await request(API_URL)
        .get(`${API_PATH}/${id}`)
        .set("x-api-key", API_KEY);
    });

    it("Then it should respond with 200 status code", () => {
      expect(response.statusCode).to.eql(200);
    });

    it("And it should respond with the expected payload", () => {
      expect(response.body).to.eql(ID_PAYLOAD);
    });
  });

  describe("When no API Key is provided", () => {
    before(async () => {
      response = await request(API_URL).get(`${API_PATH}/${id}`);
    });
    it("Then it should respond with 403 status code", () => {
      expect(response.statusCode).to.eql(403);
    });
  });

  after(async () => {
    await deleteItems();
  });
});

describe(`Given the API receives a GET request on path: ${API_PATH}/cidade/{cidade}`, () => {
  const cityName = "Rio de Janeiro";

  before(async () => {
    await populateTable();
  });

  describe("When the API Key is provided", () => {
    before(async () => {
      response = await request(API_URL)
        .get(`${API_PATH}/cidade/${cityName}`)
        .set("x-api-key", API_KEY);
    });

    it("Then it should respond with 200 status code", () => {
      expect(response.statusCode).to.eql(200);
    });

    it("And it should respond with the expected payload", () => {
      expect(response.body).to.have.deep.members(CITY_PAYLOAD);
    });
  });

  describe("When no API Key is provided", () => {
    before(async () => {
      response = await request(API_URL).get(`${API_PATH}/cidade/${cityName}`);
    });
    it("Then it should respond with 403 status code", () => {
      expect(response.statusCode).to.eql(403);
    }); 
  });

  after(async () => {
    await deleteItems();
  });
});
