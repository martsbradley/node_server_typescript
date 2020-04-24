import UserRouter from './userRouter';
import User, { PatientResult, Prescription } from './user';
import Store from './store';
import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';

describe("xxx", () => {
  const aStore: Store  = {
      createPatient:    jest.fn(),
      updatePatient:    jest.fn(),
      queryUser:        jest.fn(),
      queryAllPatients: jest.fn(),
      loadMedicines:    jest.fn(),
      closeDatabase:    jest.fn()
  };
  const date = '2020-01-01';
  const userRouter  = new UserRouter(aStore);

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/', userRouter.router);


  function postUserRouter(url: string, data: object, result: request.CallbackHandler): void {
    request(app)
            .post(url)
            .set('Accept', 'application/json')
            .send(data)
            .end(result);
  }

  const prescriptions: Prescription[] = [];

  const existingUser = {id: 28,
                        forename: 'Marty', 
                        surname: 'Buddy',
                        sex: 'Male',
                        dateOfBirth: '2020-01-01',
                        prescriptions};


  const redirectToListUsers = (done: Function): request.CallbackHandler => {
    const handler: request.CallbackHandler = (err, res): void => {
      expect(res.status).toEqual(200);
        //expect(res.header['location']).toEqual("/user/list");
      done();
    };
    return handler;
  }
  const requestFailed  = (done: Function, 
                          part: string): request.CallbackHandler => {

    const handler: request.CallbackHandler = (err, res): void => {
      expect(res.status).toEqual(400);
      expect(res.header['content-type']).toEqual("application/json; charset=utf-8");

      expect(res.text).toContain(part);
      
      done();
    };
    return handler;
  }

  const stayOnFormPage = (done: Function, 
                          part: string): request.CallbackHandler => {

    const handler: request.CallbackHandler = (err, res): void => {
      expect(res.status).toEqual(200);
      expect(res.header['content-type']).toEqual("application/json; charset=utf-8");

      expect(res.text).toContain(part);
      
      done();
    };
    return handler;
  }

  it("Positive UserRouter update patient supertest", async (done) => {
    postUserRouter('/', existingUser, redirectToListUsers(done));
  });

  it("Update patient forename blank name", async (done) => {
    postUserRouter('/', {...existingUser, forename: ''},
                  requestFailed(done, `forename must be between`));
  });

  it("Update patient surname blank name", async (done) => {
    postUserRouter('/', {...existingUser, surname: ''},
                  requestFailed(done, `surname must be between`));
  });

  // There is no error for this once because
  // the user cannot edit the id.
  it("Postive Update patient id Success", async (done) => {
    postUserRouter('/', {...existingUser, id: 400},
                  redirectToListUsers(done));
  });

  it("New patient without dob", async (done) => {
    const newUser = {...existingUser, dateOfBirth: ''}
    delete newUser.id;

    postUserRouter('/', newUser,
                  requestFailed(done, `Date Of Birth is required`));
  });

  it("List patients" , async (done) => {

    // The database returns instances of class User
    const existingUserObject = new User(29, 
                                      'Marty', 
                                      'Brads',
                                      'Male',
                                       date);

    aStore.queryAllPatients = jest.fn(() => {
      const result: PatientResult = {data: [existingUserObject], total: 1};
      return Promise.resolve(result);
    });


    request(app)
            .get('/list')
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;
              else {
                expect(res.status).toEqual(200);
                expect(res.header['content-type']).toEqual("application/json; charset=utf-8");
                  
                expect(res.text).toContain('Marty');
                expect(res.text).toContain('Brads');
                done();
              }
            });
  });
});
