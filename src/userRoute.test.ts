const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');
//global.checkSchema = require('express-validator');
//import { checkSchema } from 'express-validator';
import UserRouter from './userRouter';
import User, { PatientResult } from './user';
import Database from './database';
import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import Validation from './validation';


const queryData ={id:1,
                forename: "Martin",
                surname: "Bradley",
                sex: "Male",
                dateofbirth: "1"};
const users: User[] = [new User(1,'Martin','Bradley','Male', '2020-02-02')];

const mockQueryAllPatients =  jest.fn(() => { return new PatientResult(users, 1);});
const mockCreatePatient =  jest.fn(()    => { return 1});
const mockUpdatePatient =  jest.fn(()    => { return true});


jest.mock('./database', () => {
  return jest.fn().mockImplementation(() => {
    return {queryAllPatients: mockQueryAllPatients,
            updatePatient: mockUpdatePatient,
            createPatient: mockCreatePatient}
  });
});

/*
const okFn = jest.fn(() => {
      console.log("Yes right ok")
});
const throwFn = jest.fn(() => {
      console.log("Yes right throw")
      throw {};
});

jest.mock('./validation', () => {
  return jest.fn().mockImplementation(() => {
    return {checkValidationResults:   okFn };
  });
});*/


function responseOK(done: Function): express.Response {
    const response = new MockExpressResponse();
    response.status = function(code: any): void {
      console.log("Got here. .........");
      expect(code).toEqual(200);
      done();
    };
    return response;
}

describe("UserRouter", () => {

  const db: Database = new Database();
  const userRouter  = new UserRouter(db);

  

  it("Postive Create User", async (done) => {
    const request = new MockExpressRequest();
    request.body   = {forename : 'xxxx'};

    const response = responseOK(done);

    await userRouter.createPatientHandler(request, response, () => {});
  });


  it("Postive Update User", async (done) => {
    const request = new MockExpressRequest();
    request.body   = {forename : 'xxxx'};

    const response = responseOK(done);

    await userRouter.updatePatientHandler(request, response, () => {});
  });

  it("Negative Create User back to patient_new.html", 
                async (done) => {

//  const request = new MockExpressRequest();
//  request.body   = {forename : 'xxxx'};

////const response = new MockExpressResponse({
////  render: function(viewname: any, responseData: any): void {

////      expect(viewname).toEqual("patient_new.html");
////      done();
////    }
////  }
////);

//  console.log("checkValidationResults");
//  const validation = new Validation()
//  validation.checkValidationResults(request);

    done();

    //await userRouter.createPatientHandler(request, response);
  });

  it("listPatients one user", async (done) => {

    const request = new MockExpressRequest();
    const response = new MockExpressResponse();

    response.status =  function(code: Number): void {
      // const user: User = responseData.users[0];
      console.log("Here done ok");
    
      expect(code).toEqual(200);
      done();
    }

    await userRouter.listPatients(request, response);
  });


  it("UserRouter Postive Update Patient", async (done) => {

    const response = responseOK(done);
    const request = new MockExpressRequest();

    request.body   = {
                      id: 11,
                      forename : 'xxxx'};

    console.log("here......")
    await userRouter.updatePatientHandler(request, response, () =>{
      console.log("next called");
      done()
    });
  });
});
