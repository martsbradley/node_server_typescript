//const { Pool } = require('pg')
//import Pool from 'pg';
import { Pool } from 'pg';
import User from './user';


console.log("Create Database Connection");

const pool = new Pool({
  user: 'pguser',
  host: 'localhost',
  database: 'pgdatabase',
  password: 'pguser1',
  port: 5432,
})


export const saveName = async (data: User): Promise<boolean> => {
    console.log("saveName");

    let result = false;

    console.log(`Should update to ${data.forename} ${data.surname}`);
    await pool.query('update patient set forename = $1, surname = $2 WHERE id = $3',
        [data.forename, data.surname, data.id]);

    result = true;
    return result;
}

export const queryUser = async (id: number): Promise<User> => {

    console.log(`Query User ${id}`);

    let user: User = null;

    const dbresult = await pool.query('SELECT * from patient where id = $1', [id]);

    if (dbresult.rows.length === 1) {
        const row = dbresult.rows[0];

        user = new User(row.id,
                        row.forename,
                        row.surname,
                        row.sex,
                        row.dateofbirth);
        console.log("Found user " + user);
    }
    return user;
}
export const queryUserThrow = async (id: number): Promise<User> => {

    console.log(`Query User ${id}`);

    let user: User = null;

    const dbresult = await pool.query('SELECT * from patient where id = $1', [id]);

    if (dbresult.rows.length !== 1) {
        console.log(`${id} was not found, throwing an error`);
      throw new Error('Not found') // Express will catch this on its own.
    }
    const row = dbresult.rows[0];

    user = new User(row.id,
                    row.forename,
                    row.surname,
                    row.sex,
                    row.dateofbirth);
    console.log("Found user " + user);
    
    return user;
}


export const query = async (): Promise<User[]> => {
  console.log("Query All Users");
  const users: User[] = [];

  try {
    const dbresult = await pool.query('SELECT * from patient order by id');

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
      console.log("issue..." + error);
  }
  return users;
}

export function closeDatabase(): void {
  pool.end()
}
