import UserRouter from './userRouter';
import User, { PatientResult, Prescription } from './user';
import Store from './store';
import {MockStore} from './store-mock';
import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';

describe("userRouter", () => {

  const aStore: Store = MockStore;
  const date = '2020-01-01';
  const userRouter = new UserRouter(aStore);

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

  function putUserRouter(url: string, data: object, result: request.CallbackHandler): void {
    request(app)
            .put(url)
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


  const requestGood = (done: Function): request.CallbackHandler => {
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

  it("Pos: Create patient supertest", async (done) => {
    postUserRouter('/', existingUser, requestGood(done));
  });

  it("Neg: Post Patient missing dob", async (done) => {
    const newUser = {...existingUser, dateOfBirth: ''}
    delete newUser.id;

    postUserRouter('/', newUser,
                  requestFailed(done, `Date Of Birth is required`));
  });

  it("Neg: Post Patient missing surname", async (done) => {
    const newUser = {...existingUser, surname: ''}
    delete newUser.id;

    postUserRouter('/', newUser,
                  requestFailed(done, `surname must be between `));
  });

  it("Neg: Update patient forename blank", async (done) => {
    putUserRouter('/', {...existingUser, forename: ''},
                  requestFailed(done, `forename must be between`));
  });

  it("Neg: Update patient surname blank", async (done) => {
    putUserRouter('/', {...existingUser, surname: ''},
                  requestFailed(done, `surname must be between`));
  });

  it("Pos: Update patient", async (done) => {
    putUserRouter('/', {...existingUser, id: 20},
                  requestGood(done));
  });


  it("Pos: List patients" , async (done) => {

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
