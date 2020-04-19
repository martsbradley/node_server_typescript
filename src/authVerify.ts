import express from 'express';
import Database  from './database';
import { checkSchema } from 'express-validator';
import Validation from './validation';
//import {idParamSchema,UserSchema, NewUserSchema} from './schema';
import {idParamSchema,UserSchema, NewUserSchema} from './schema';
//import { validationResult } from 'express-validator';
//import PageInfo from './pageInfo';
import Store from './store';

export default class AuthVerify {
    router: express.Router;
    validation: Validation = new Validation();
    db: Store;

    constructor(db: Store) {
        this.router = express.Router();
        this.db = db;


        this.router.post('/verifyUser', 
                         //checkSchema(NewUserSchema), 
                         //this.validation.middle('patient_new.html'),
                         this.verifyUser.bind(this));

    }



    async verifyUser(req: express.Request, 
                     res: express.Response, 
                     next: express.NextFunction): Promise<void> {
        const user = req.body;
        console.log("verifyUser");
        console.log(user);

        //return res.redirect('/user/list');
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ a: 1 }, null, 3));
    }
}
