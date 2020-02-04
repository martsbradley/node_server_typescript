const { Pool } = require('pg')

export default function doit() {
   console.log("hi therre from database");

    const pool = new Pool({
      user: 'pguser',
      host: 'localhost',
      database: 'pgdatabase',
      password: 'pguser1',
      port: 5432,
    })

    pool.query('select * from patient', 
               (err: any, res: any) => {
                  console.log(err, res)
                  pool.end()
               }
    );
}
