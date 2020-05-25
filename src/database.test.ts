import Database  from './database';
import { Pool } from 'pg';
import User from './user';
import PageInfo from './pageInfo';

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(() => { return {rows:[]}}),
    connect: jest.fn()
  };
  return {Pool: jest.fn(() => mPool)};
});


describe('Database', () => {

  const date = '2020-01-01';

  let pool: any;
  let db: Database;
  beforeAll(() => {
    pool = new Pool();
    db  = new Database();
  });


  it('createPatient', async () => {
    const id: number = undefined;

    const user = new User (id, "m", "b", "m", date); 

    const rows: number[] = [99];
    const dbresult = {
      rowCount: 1,
      rows: rows
    };

    pool.query.mockResolvedValueOnce(dbresult);

    return db.createPatient(user).then(data => expect(data).toStrictEqual(99));
  });

  it('queryPatient no rows', async () => {
    const pageInfo = new PageInfo(1,5, "");
    pool.query.mockResolvedValueOnce({ rows: [],           rowCount: 0 });
    pool.query.mockResolvedValueOnce({ rows: [{count: 0}], rowCount: 1 });
    return db.queryAllPatients(pageInfo)
             .then(patientResult => {
                    expect(patientResult.data).toStrictEqual([])
                    expect(patientResult.total).toEqual(0)});
  })

  it('database down', async () => {
    pool.query.mockImplementation(() => {
      throw {"pg": "some unknown issue from PostGreSQL" }});

    const pageInfo = new PageInfo(1,5, "");
    return db.queryAllPatients(pageInfo).
          catch(error => 
            expect(error.general).
                  toStrictEqual("Database Error, unable to Query User"));
  })

  it('queryPatient one row', async () => {

    const data = [ {id: 1,
                    forename: "m",
                    surname: "b",
                    sex: "m",
                    dateofbirth: date,
                    fullcount: 120 }];

    pool.query.mockResolvedValueOnce({ rows: data, rowCount: 1 });

    const u = new User(1, "m", "b", "m", date);

    const pageInfo = new PageInfo(1,5, "");
    return db.queryAllPatients(pageInfo)
             .then(patientResult => 
                {expect(patientResult.data).toStrictEqual([u])
                 expect(patientResult.total).toEqual(120)});
  })
});
