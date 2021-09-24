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

// This is the path for the endpoint to be tested
const API_PATH = '/exercise-02'

let response;
describe(`Given the API receives a GET request on path: ${API_PATH}`, () => {});