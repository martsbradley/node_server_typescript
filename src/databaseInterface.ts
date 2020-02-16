//const { Pool } = require('pg')
//import Pool from 'pg';
import {Pool} from 'pg';
import { Response} from "express";


console.log("Create Database Connection");

const pool = new Pool({
  user: 'pguser',
  host: 'localhost',
  database: 'pgdatabase',
  password: 'pguser1',
  port: 5432,
})


export const saveName = async (id:       number, 
                               name:     string, 
                               response: Response): Promise<boolean> => 
{
    console.log("saveName");

   let result = false;

    try {
        await pool.query('update patient set forename = $1 WHERE id = $2',
                         [name, id]);

        response.redirect('messages/id');
        result = true;
    }
    catch(error) {
                                    
      response.status(500).json(error);
    }
    return result;
}

export const query = async (response: Response): Promise<boolean> => 
{
    console.log("Query Database");
    let result = false;

    try {
        const dbresult = await pool.query('select * from patient');
        response.status(200).json(dbresult.rows);
        result = true;
    }
    catch(error) {
      response.status(500).json(error);
    }
    return result;
}

export function closeDatabase(): void {
    pool.end()
}
