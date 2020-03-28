import Database  from './database';
import { Pool } from 'pg';
import User from './user';

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(() => { return {rows:[]}}),
    connect: jest.fn()
  };
  return {Pool: jest.fn(() => mPool)};
});


describe('Database', () => {

  let pool: any;
  let db: Database;
  beforeAll(() => {
    pool = new Pool();
    db  = new Database();
  });

  it('no rows', async () => {
    return db.queryAllPatients().then(data => expect(data).toStrictEqual([]));
  })

  it('createPatient', async () => {
    const id :number = undefined;

    const user = new User (id, "m", "b", "m", new Date()); 

    let rows = [99];
    let dbresult = {
      rowCount: 1,
      rows: rows
    };

    pool.query.mockResolvedValueOnce(dbresult);

    return db.createPatient(user).then(data => expect(data).toStrictEqual(99));
  });

  it('one row', async () => {

    const date = new Date();
    const data = [ {id: 1,
                    forename: "m",
                    surname: "b",
                    sex: "m",
                    dateofbirth: date}];

    pool.query.mockResolvedValueOnce({ rows: data, rowCount: 0 });

    const u = new User(1, "m", "b", "m", date);

    return db.queryAllPatients().then(data => expect(data).toStrictEqual([u]));
  })



  it('database down', async () => {
    pool.query.mockImplementation(() => {
      throw {"pg": "some unknown issue from PostGreSQL" }});

    return db.queryAllPatients().
          catch(error => 
            expect(error.general).
                  toStrictEqual("Database Error, unable to Query User"));
  })
})