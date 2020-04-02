const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');
import UserRoutes from './userRouter';
import User from './user';
import Database from './database';
import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';

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

function redirectUserList(done: Function): express.Response {
  const response = new MockExpressResponse();
  response.redirect = function(viewname: any): void {
    console.log("Got here. .........");
    expect(viewname).toEqual('/user/list');
    done();
  };
  return response;
}


describe("UserRoutes", () => {

  const db: Database = new Database();
  const userRoutes  = new UserRoutes(db);

  it("Update Patient", async (done) => {

    const response = redirectUserList(done);

    const request = new MockExpressRequest();
    //request.body   = {id : 24,
    request.body   = {
                      forename : 'xxxx'};

    await userRoutes.updatePatientHandler(request, response, () =>{});
  });

  it("Create User", async (done) => {
    const response = redirectUserList(done);

    const request = new MockExpressRequest();
    request.body   = {forename : 'xxxx'};

    await userRoutes.createPatientHandler(request, response);
  });


  it("Update User", async (done) => {
    const request = new MockExpressRequest();
    const response = redirectUserList(done);

    request.body   = {forename : 'xxxx'};

    await userRoutes.updatePatientHandler(request, response, () => {});
  });

  it("listHandler one user", async (done) => {

    const request = new MockExpressRequest();
    const response = new MockExpressResponse({

    render: function(viewname: any, responseData: any): void {
        const user: User = responseData.users.rows[0];
        console.log(`Loaded ${user.forename} ${user.surname}`);
        done();
      }
    });

    await userRoutes.listPatients(request, response);
  });

  it("Positive UserRouter update patient", async (done) => {

    const userRoutes  = new UserRoutes(db);
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use('/user', new UserRoutes(new Database()).router);

    request(app)
            .post("/user")
            .set('Accept', 'application/json')
            .send({id: 22,
                   forename: 'Bradley', 
                   surname: 'Buddy',
                   sex: 'Male',
                   dob: 'Sat Jan 01 2011 00:00:00'})
        .end(function(err, res) {
            // The supertest header looks different.
            expect(res.status).toEqual(302);
            expect(res.header['location']).toEqual("/user/list");
            console.log(`text is '${res.text}'`);

            done();
        });
  });
});