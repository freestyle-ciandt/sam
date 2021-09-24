const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const {
    expect,
    request,
} = chai;

const {
    API_KEY,
    API_URL,
} = process.env;

const SUCCESS_PAYLOAD = require('./resources/success-payload.json');

// This is the path for the endpoint to be tested
const API_PATH = '/exercise-01'

let response;
describe(`Given the API receives a GET request on path: ${API_PATH}`, () => {
    describe('When the API Key is provided', () => {
        before(async () => {
            response = 
                await request(API_URL)
                    .get(API_PATH)
                    .set('x-api-key', API_KEY);
        });

        it('Then it should respond with 200 status code', () => {
            expect(response.statusCode).to.eql(200);
        });
    
        it('And it should respond with the expected payload', () => {
            expect(response.body).to.eql(SUCCESS_PAYLOAD);
        });
    });

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