const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');
import UserRoutes from './userRouter';
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

describe("UserRoutes", () => {

  it("Update Patient", async (done) => {

    const db: Database = new Database();
    const request = new MockExpressRequest();
    const response = new MockExpressResponse({

      redirect: function(url: any) {
              console.log("here.........");
              console.log(url);
        }
    });

    response.redirect = function(viewname: any) {
          console.log("Got here. .........");
          expect(viewname).toEqual('/user/list');
          done();
    };

    //request.header = () => {return 'martyok';};
    request.body   = {id : 24,
                      forename : 'xxxx'};

    const userRoutes  = new UserRoutes(db);
    await userRoutes.updatePatientHandler(request, response, () =>{});
  });

  it("Create User", async (done) => {

    const db: Database = new Database();
    const userRoutes  = new UserRoutes(db);
    const request = new MockExpressRequest();
    const response = new MockExpressResponse();

    response.redirect = function(viewname: any) {
          console.log("Got here. .........");
          expect(viewname).toEqual('/user/list');
      done();
    };

    request.header = () => {return 'martyok';};
    request.body   = {forename : 'xxxx'};

    await userRoutes.createPatientHandler(request, response);
  });

  it("Update User", async (done) => {

    const db: Database = new Database();
    const userRoutes  = new UserRoutes(db);
    const request = new MockExpressRequest();
    const response = new MockExpressResponse();

    response.redirect = function(viewname: any) {
      console.log("Got here. .........");
      expect(viewname).toEqual('/user/list');
      done();
    };

    request.header = () => {return 'martyok';};
    request.body   = {forename : 'xxxx'};

    await userRoutes.updatePatientHandler(request, response, () => {});
  });

  it("listHandler one user", async (done) => {

    const db: Database = new Database();
    const request = new MockExpressRequest();
    const response = new MockExpressResponse({

    render: function(viewname: any, responseData: any): void {
        const user: User = responseData.users.rows[0];
        console.log(`Loaded ${user.forename} ${user.surname}`);
        done();
      }
    });


    const userRoutes  = new UserRoutes(db);
    await userRoutes.listPatients(request, response);
  });
});