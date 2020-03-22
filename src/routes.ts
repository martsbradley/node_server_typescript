import express from 'express';
import Database  from './databaseInterface';
//import { Location,checkSchema, validationResult } from 'express-validator';

import {checkValidationResults} from './validation';
import { validationResult } from 'express-validator';

export default class Routes {

    db: Database;

    constructor(dab: Database) {
        this.db = dab;
    }

    async saveHandler(req: express.Request, res: express.Response) {
        console.log(`hit save from ${req.header('Referer')}`);

        const user = req.body;
        try {
            console.log(`Need to save "${user.surname}"`);
            console.log(user)
            checkValidationResults(req);
            console.log("validation passed");

            await this.db.savePatient(user);
        }
        catch (err) {
            console.log("validation or logic failed");
            return res.render('edit.html', {'user': user,
                                            'errors': err});
        }

        return res.redirect('/user/list');
    }

    async editHandler (req: express.Request, res: express.Response) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render('error.html');
        }
        const id = parseInt(req.query.id, 10);
        console.log(`Handling the /user/edit/${id}`);

        const user = await this.db.queryUser(id);
        const data = {'user': user};

        if (user) {
            res.render('edit.html', data);
        }
        else {
            console.log(`User id ${id} not found`);
            return res.render('error.html');
        }
    }

    async listHandler(req: express.Request,
                    res: express.Response) {

        const users = await this.db.queryAllPatients();

        const data = {
            'mynames': ['joan', 'paul', 'lisa'],
            'firstName': 'Marty',
            'users': users,
            'lastName': 'Bradley',
        };

        return res.render('home.html', data);
    }
}