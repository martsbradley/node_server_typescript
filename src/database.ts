import { Pool } from 'pg';
import User, { Medicine, Prescription, MedicineResult, PatientResult } from './user';
import assert  from 'assert';
import PageInfo, {PageResult} from './pageInfo';
import Store from './store';


export default class Database implements Store {

  pool: Pool;

  constructor() {
      //console.log(`Connecting to Database ... ${process.env["PG_DATABASE"]}`);
    this.pool = new Pool({
        user:     process.env["PG_USER"],
        password: process.env["PG_PASSWORD"],
        database: process.env["PG_DATABASE"],
        host:     process.env["PG_SERVER"],
        port: 5432,
      });

  }
    
    async createPrescription(patientId: number, 
                             prescription: Prescription): Promise<number>{
  //console.log('createPrescription');
  //console.log(`patientId ${patientId}`);
  //console.log(prescription);

    assert(prescription.prescriptionId === undefined);
    assert(prescription.medicine !== null);
    assert(prescription.medicine.id !== undefined);

    const res = await this.pool.query('insert into prescription ' +
                                      '(patient_id, medicine_id,start_date, end_date, amount) ' +
                                      'values ($1, $2, TO_DATE($3, \'YYYY-MM-DD\'), TO_DATE($4, \'YYYY-MM-DD\'), $5) ' +
                                      'returning id',
                                      [patientId,
                                       prescription.medicine.id,
                                       prescription.startDate,
                                       prescription.endDate,
                                       'lots']);
    if (res.rowCount != 1) {
        throw {"general": "Database Error, unable to Save User"};
    }
    return res.rowCount;
  }

  async createPatient(user: User): Promise<number>  {
    assert(user.id === undefined);

    const version = 0;

      //console.log(`Inserting user with ${user.dateOfBirth}`);

    const res = await this.pool.query('insert into patient ' +
                                      '(forename, surname, sex, dateofbirth, version) ' +
                                      'values ($1, $2, $3, TO_DATE($4, \'YYYY-MM-DD\'), $5) ' +
                                      'returning id',
                                      [user.forename, 
                                      user.surname, 
                                      user.sex, 
                                      user.dateOfBirth,
                                      version]);
    if (res.rowCount != 1) {
        //console.log(res);
        throw {"general": "Database Error, unable to Save User"};
    }
    return res.rows[0];
  }

  async updatePatient(user: User): Promise<boolean>  {
    assert(user.id !== undefined);

    let result = false;

      //console.log(`Update Patient ${user.id} to ${user.forename} ${user.surname} ${user.dateOfBirth}`);

    try {
        const res = await this.pool.query('update patient set ' +
                          'forename    = $1,' +
                          'surname     = $2,' +
                          'sex         = $3,' +
                          'dateofbirth = $4 ' +
                          'WHERE id = $5',
            [user.forename, user.surname, user.sex, user.dateOfBirth, user.id]);

        //console.log(`updatePatient ${res.rowCount}`);
        if (res.rowCount == 0) {
            //console.log(`throw error1`);
          throw {"general": "Database Error, unable to Save User"};
        }
    }catch (err) {
        //console.log("Save failed " + err);

        throw {"general": "Database Error, unable to Save User"};
    }

    result = true;
    return result;
}

async queryUser (id: number): Promise<User> {

    //console.log(`Query User ${id}`);

    const queryStr= 
          'select p.id as pID, m.id as mID, pre.id as preid,  '   +
          'to_char(p.dateofbirth,  \'YYYY-MM-DD\') as birthdate, ' +
          'to_char(pre.start_date, \'YYYY-MM-DD\') as startdate, ' +
          'to_char(pre.end_date,   \'YYYY-MM-DD\') as enddate, ' +
          '* '                                    +
          'from patient p '                       +
          'left outer join prescription pre '     +
          'on p.id = pre.patient_id '             +
          'left outer join medicine m '           +
          'on pre.medicine_id = m.id '            +
          'where p.id = $1';

    const dbresult = await this.pool.query(queryStr, [id]);

    //console.log("Running query");

    let user: User = null;

    if (dbresult.rows.length > 0) {
      let firstRow = true;

      for (const i in dbresult.rows) {
        const row = dbresult.rows[i];
          //console.log(row);

        if (firstRow) {

          user = new User(row.pid,
                          row.forename,
                          row.surname,
                          row.sex,
                          row.birthdate);
          firstRow = false;
        }

        if (row.medicine_id !== null) {

        const medicine = new Medicine(row.mid,
                                      row.name,
                                      row.manufacturer,
                                      row.delivery_method);

          const prescription = new Prescription(row.preid,
                                                row.startdate,
                                                row.enddate,
                                                row.amount ,
                                                medicine);
          user.addPrescription(prescription);
        }
      }

        //console.log("Found user " + user);
    }
    return user;
}

  async queryAllPatients(pageInfo: PageInfo): Promise<PatientResult> {
    let result: PatientResult;

      //console.log(`paging limit is ${pageInfo.limit} offset ${pageInfo.offset}`)
    try {
      const query = 'SELECT *,to_char(dateofbirth, \'YYYY-MM-DD\') as dateofbirth, ' +
                    'count(*) OVER() AS fullcount ' +
                    'from patient order by id ' + 
                    'LIMIT $1 OFFSET $2';

      const dbresult = await this.pool.query(query, 
                                            [pageInfo.limit, 
                                             pageInfo.offset]);
      const users: User[] = [];
      for (const i in dbresult.rows) {
          const row = dbresult.rows[i];
          //console.log(`${row.forename} -> ${row.dateofbirth}`);
          const user = new User(row.id,
                                row.forename,
                                row.surname,
                                row.sex,
                                row.dateofbirth);
        users.push(user);
      }

      let count = 0;
      if (dbresult.rows.length > 0) {
          count = dbresult.rows[0].fullcount;
      }

      result = new PatientResult(users, count);
    }
    catch (error) {
        //console.log(error);
        throw {"general": "Database Error, unable to Query User"};
    }

    return result;
  }

//export class PageResult<T> {
  async loadMedicines(pageInfo: PageInfo): Promise<MedicineResult> {
    let result: MedicineResult ;

    try {

      let where = "";

      //@typescript-eslint-disable-next-line no-explicit-any
      const queryArgs: any[]= [pageInfo.limit, pageInfo.offset]

      if (pageInfo.nameFilter !== '') {
          const arg: string = pageInfo.nameFilter + '%';
          queryArgs.push(arg);
          where = "WHERE name like $3 ";
      }

      const query = `SELECT *, count(*) OVER() AS fullcount from medicine ${where} ORDER BY id LIMIT $1 OFFSET $2`;

      const dbresult = await this.pool.query(query, queryArgs);

      const meds: Medicine[] = [];
      for (const i in dbresult.rows) {
          const row = dbresult.rows[i];
          const med = new Medicine(row.id,
                                   row.name,
                                   row.manufacturer,
                                   row.delivery_method);
          meds.push(med);
      }
      
      let count = 0;

      if (dbresult.rows.length > 0) {
          count = dbresult.rows[0].fullcount;
      }

      result = new MedicineResult(meds, count);
    }
    catch (error) {
        //console.log(error);
        throw {"general": "Database Error, unable to Query Medicine"};
    }
    return result;
  }

  closeDatabase(): void{ 
      this.pool.end()
      //console.log("closed pool")
  }
}
