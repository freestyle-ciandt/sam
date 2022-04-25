const chai = require("chai");
const chaiHttp = require("chai-http");

const {
  removePropertyFromObject,
  generateInvalidRequest,
  generateEmptyField,
} = require("./validator");

chai.use(chaiHttp);

const { expect, request } = chai;

const { API_KEY, API_URL } = process.env;

const SUCCESS_REQUEST = require("./resources/success-request.json");
const INVALID_INPUT_RESPONSE = require("./resources/invalid-input-payload.json");
const SUCCESS_RESPONSE = require("./resources/success-payload.json");

// This is the path for the endpoint to be tested
const API_POST_PATH = "/exercise-04";
const API_GET_PATH = "/exercise-02";

let response;
describe(`Given the API receives a POST request on path: ${API_POST_PATH}`, () => {
  Object.keys(SUCCESS_REQUEST).forEach((propertyName) => {
    describe(`When ${propertyName} field is not provided`, () => {
      before(async () => {
        response = await request(API_URL)
          .post(API_POST_PATH)
          .send(removePropertyFromObject(SUCCESS_REQUEST, propertyName))
          .set("x-api-key", API_KEY);
      });

      it("Then it should respond with 400 status code", () => {
        expect(response.statusCode).to.eql(400);
      });

      it("And it should respond with the expected payload", () => {
        expect(response.body).to.eql(INVALID_INPUT_RESPONSE);
      });
    });

    describe(`When ${propertyName} does not match schema type`, () => {
      before(async () => {
        response = await request(API_URL)
          .post(API_POST_PATH)
          .send(generateInvalidRequest(SUCCESS_REQUEST, propertyName))
          .set("x-api-key", API_KEY);
      });

      it("Then it should respond with 400 status code", () => {
        expect(response.statusCode).to.eql(400);
      });

      it("And it should respond with the expected payload", () => {
        expect(response.body).to.eql(INVALID_INPUT_RESPONSE);
      });
    });

    describe(`When ${propertyName} is empty`, () => {
      before(async () => {
        response = await request(API_URL)
          .post(API_POST_PATH)
          .send(generateEmptyField(SUCCESS_REQUEST, propertyName))
          .set("x-api-key", API_KEY);
      });

      it("Then it should respond with 400 status code", () => {
        expect(response.statusCode).to.eql(400);
      });

      it("And it should respond with the expected payload", () => {
        expect(response.body).to.eql(INVALID_INPUT_RESPONSE);
      });
    });
  });

  describe("When a correct data is provided", () => {
    before(async () => {
      response = await request(API_URL)
        .post(API_POST_PATH)
        .send(SUCCESS_REQUEST)
        .set("x-api-key", API_KEY);
    });

    it("Then it should respond with 200 status code", () => {
      expect(response.statusCode).to.eql(200);
    });

    it("And it should respond with the expected payload", () => {
      expect(response.body).to.eql(SUCCESS_RESPONSE);
    });
  });

  describe("When an invalid API Key is provided", () => {
    before(async () => {
      response = await request(API_URL)
        .post(API_POST_PATH)
        .send({})
        .set("x-api-key", "invalidKey");
    });
    it("Then it should respond with 403 status code", () => {
      expect(response.statusCode).to.eql(403);
    });
  });

  describe("When no API Key is provided", () => {
    before(async () => {
      response = await request(API_URL).post(API_POST_PATH).send({});
    });
    it("Then it should respond with 403 status code", () => {
      expect(response.statusCode).to.eql(403);
    });
  });
});

describe(`Given the API receives a GET request on path: ${API_GET_PATH}`, () => {
  describe("When the data exist in the DynamoDB", () => {
    before(async () => {
      response = await request(API_URL)
        .get(`${API_GET_PATH}/${SUCCESS_REQUEST.id}`)
        .set("x-api-key", API_KEY);
    });

    it("Then it should respond with 200 status code", () => {
      expect(response.statusCode).to.eql(200);
    });

    it("And it should respond with the expected payload", () => {
      expect(response.body).to.eql(SUCCESS_REQUEST);
    });
  });
});
