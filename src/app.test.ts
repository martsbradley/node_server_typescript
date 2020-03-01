var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');
import Routes from './routes';
import User from './user';
import Database from './databaseInterface';


var data ={id:1,
            forename: "Martin",
            surname: "Bradley",
            sex: "Male",
            dateofbirth: "1"};

const mockQueryAllPatients =  jest.fn(() => { return {rows:[data]}});

jest.mock('./databaseInterface', () => {
  return jest.fn().mockImplementation(() => {
    return {queryAllPatients: mockQueryAllPatients}
  });
});

describe("Routes", () => {
  it("listHandler one user", async (done) => {

    const db: Database = new Database();
    const routes: Routes = new Routes(db);
    const request = new MockExpressRequest();
    const response = new MockExpressResponse({

      render: function(viewname: any, responseData: any) {
        console.log(responseData);
        const user: User = responseData.users.rows[0];
        console.log(user);
      }
    });

    await routes.listHandler(request, response);
    done();
  });
});