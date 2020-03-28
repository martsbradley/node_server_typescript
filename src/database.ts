import { Pool } from 'pg';
import User, { Prescription } from './user';
import assert  from 'assert';

export default class Database {

  pool: Pool;

  constructor() {
    console.log(`Connecting to Database ... ${process.env["PG_DATABASE"]}`);
    this.pool = new Pool({
        user:     process.env["PG_USER"],
        password: process.env["PG_PASSWORD"],
        database: process.env["PG_DATABASE"],
        host:     process.env["PG_SERVER"],
        port: 5432,
      });

  }

  async createPatient(user: User): Promise<number>  {
    assert(user.id === undefined);

    const version = 0;

    const res = await this.pool.query('insert into patient ' +
                                      '(forename, surname, sex, dateofbirth, version) ' +
                                      'values ($1, $2, $3, $4, $5) ' +
                                      'returning id',
                                      [user.forename, 
                                      user.surname, 
                                      user.sex, 
                                      user.dob,
                                      version]);
    if (res.rowCount != 1) {
        console.log(res);
        throw {"general": "Database Error, unable to Save User"};
    }
    return res.rows[0];
  }

  async updatePatient(user: User): Promise<boolean>  {
    assert(user.id !== undefined);

    let result = false;

    console.log(`Update Patient ${user.id} to ${user.forename} ${user.surname} ${user.dob}`);

    try {
        const res = await this.pool.query('update patient set ' +
                          'forename    = $1,' +
                          'surname     = $2,' +
                          'sex         = $3,' +
                          'dateofbirth = $4 ' +
                          'WHERE id = $5',
            [user.forename, user.surname, user.sex, user.dob, user.id]);

        console.log(`updatePatient ${res.rowCount}`);
        if (res.rowCount == 0) {
          console.log(`throw error1`);
          throw {"general": "Database Error, unable to Save User"};
        }
    }catch (err) {
        console.log("Save failed " + err);

        throw {"general": "Database Error, unable to Save User"};
    }

    result = true;
    return result;
}

async queryUser (id: number): Promise<User> {

    console.log(`Query User ${id}`);

    const queryStr= 'select p.id as pID, m.id as mID, * '   +
                    'from patient p '                       +
                    'left outer join prescription pre '     +
                    'on p.id = pre.patient_id '             +
                    'left outer join medicine m '           +
                    'on pre.medicine_id = m.id '            +
                    'where p.id = $1';

    const dbresult = await this.pool.query(queryStr, [id]);

    console.log("Running query");

    let user: User = null;

    if (dbresult.rows.length > 0) {
      let firstRow = true;

      for (const i in dbresult.rows) {
        const row = dbresult.rows[i];

        if (firstRow) {

        //  console.log("Got date..");
        //console.log(Object.keys(row.dateofbirth));
        //console.log(`Date  is ${row.dateofbirth}`);
        //console.log(`Using ${row.pid} as the id`);
          const d = new Date(row.dateofbirth);
        // console.log(d);

          user = new User(row.pid,
                          row.forename,
                          row.surname,
                          row.sex,
                          d);
          firstRow = false;
        }

        if (row.medicine_id !== null) {
        //const prescription ={medicineId: row.medicine_id,
        //                      startDate: row.start_date,
        //                      endDate:   row.end_date,
        //                      amount:    row.amount ,
        //                      name:      row.name};
          const prescription = new Prescription(row.medicine_id,
                                                row.start_date,
                                                row.end_date,
                                                row.amount ,
                                                row.name);
          user.addPrescription(prescription);
        }
      }

      console.log("Found user " + user);
    }
    return user;
}

  async queryAllPatients(): Promise<User[]> {
    const users: User[] = [];

    try {
      const dbresult = await this.pool.query('SELECT * from patient order by id');

      for (const i in dbresult.rows) {
          const row = dbresult.rows[i];
          const user = new User(row.id,
                                row.forename,
                                row.surname,
                                row.sex,
                                row.dateofbirth);
        users.push(user);
      }
    }
    catch (error) {
        console.log(error);
        throw {"general": "Database Error, unable to Query User"};
    }
    return users;
  }

  closeDatabase(): void{ 
      this.pool.end()
      console.log("closed pool")
  }
}