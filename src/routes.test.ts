const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');
import Routes from './routes';
import User from './user';
import Database from './database';


const queryData ={id:1,
                forename: "Martin",
                surname: "Bradley",
                sex: "Male",
                dateofbirth: "1"};

const mockQueryAllPatients =  jest.fn(() => { return {rows:[queryData]}});
const mockCreatePatient =  jest.fn(()    => { return 1});
const mockUpdatePatient =  jest.fn(()    => { return true});


jest.mock('./database', () => {
  return jest.fn().mockImplementation(() => {
    return {queryAllPatients: mockQueryAllPatients,
            updatePatient: mockUpdatePatient,
            createPatient: mockCreatePatient}
  });
});

describe("Routes", () => {

  it('Display Environment', () => {
    console.log(`Logging in as ${process.env.PG_USER} into database ${process.env.PG_DATABASE}`);
  })


});