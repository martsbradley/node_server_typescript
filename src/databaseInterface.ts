import { Pool } from 'pg';
import User from './user';

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




  async savePatient(data: User): Promise<boolean>  {
    console.log("savePatient");

    let result = false;

    console.log(`Should update to ${data.forename} ${data.surname}`);

    console.log(data);

    try {
        await this.pool.query('update patient set ' +
                          'forename = $1,' +
                          'surname  = $2,' +
                          'sex      = $3 ' +
                          'WHERE id = $4',
            [data.forename, data.surname, data.sex, data.id]);
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
        console.log(row);

        if (firstRow) {
          console.log(`Using ${row.pid} as the id`);
          user = new User(row.pid,
                          row.forename,
                          row.surname,
                          row.sex,
                          row.dateofbirth);
          firstRow = false;
        }

        if (row.medicine_id !== null) {
          const prescription ={medicineId: row.medicine_id,
                                startDate: row.start_date,
                                endDate:   row.end_date,
                                amount:    row.amount ,
                                name:      row.name};

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
      console.log("closing pool")
      this.pool.end()
      console.log("closed pool")
  }
}