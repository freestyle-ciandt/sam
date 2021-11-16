const chai = require('chai');
const chaiHttp = require('chai-http');

const {
    removePropertyFromObject,
    generateInvalidRequest,
} = require('./validator');

chai.use(chaiHttp);

const {
    expect,
    request,
} = chai;

const {
    API_KEY,
    API_URL,
} = process.env;

const SUCCESS_REQUEST = require('./resources/success-request.json');
const INVALID_INPUT_RESPONSE = require('./resources/invalid-input-payload.json');
const SUCCESS_RESPONSE = require('./resources/success-payload.json');

// This is the path for the endpoint to be tested
const API_PATH = '/clientes'

let response;
describe(`Given the API receives a GET request on path: ${API_PATH}`, () => {
    Object.keys(SUCCESS_REQUEST).forEach((propertyName) => {
        describe(`When ${propertyName} field is not provided`, () => {
            before(async () => {
                response =
                    await request(API_URL)
                        .post(API_PATH)
                        .send(removePropertyFromObject(SUCCESS_REQUEST, propertyName))
                        .set('x-api-key', API_KEY);
            });

            it('Then it should respond with 400 status code', () => {
                expect(response.statusCode).to.eql(400);
            });

            it('And it should respond with the expected payload', () => {
                expect(response.body).to.eql(INVALID_INPUT_RESPONSE);
            });
        });

        describe(`When ${propertyName} does not match schema type`, () => {
            before(async () => {
                response =
                    await request(API_URL)
                        .post(API_PATH)
                        .send(generateInvalidRequest(SUCCESS_REQUEST, propertyName))
                        .set('x-api-key', API_KEY);
            });

            it('Then it should respond with 400 status code', () => {
                expect(response.statusCode).to.eql(400);
            });

            it('And it should respond with the expected payload', () => {
                expect(response.body).to.eql(INVALID_INPUT_RESPONSE);
            });
        })
    });

    describe('When a correct data is provided', () => {
        before(async () => {
            response =
                await request(API_URL)
                    .post(API_PATH)
                    .send(SUCCESS_REQUEST)
                    .set('x-api-key', API_KEY);
        });

        it('Then it should respond with 200 status code', () => {
            expect(response.statusCode).to.eql(200);
        });

        it('And it should respond with the expected payload', () => {
            expect(response.body).to.eql(SUCCESS_RESPONSE);
        });

        // TODO: run /GET from exercise 2 here
        // it('And it should respond with the expected payload', () => {
        //     expect(response.body).to.eql(SUCCESS_RESPONSE);
        // });
    })

    describe('When an invalid API Key is provided', () => {
        before(async () => {
            response = await request(API_URL)
                .get(API_PATH)
                .set('x-api-key', 'invalidKey');
        });
        it('Then it should respond with 403 status code', () => {
            expect(response.statusCode).to.eql(403);
        });
    });

    describe('When no API Key is provided', () => {
        before(async () => {
            response = await request(API_URL)
                .get(API_PATH);
        });
        it('Then it should respond with 403 status code', () => {
            expect(response.statusCode).to.eql(403);
        });
    });

});