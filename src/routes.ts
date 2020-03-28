import express from 'express';
import Database  from './database';
//import { Location,checkSchema, validationResult } from 'express-validator';
//import { Location,checkSchema, validationResult } from 'express-validator';

import {checkValidationResults, UserSchema} from './validation';
import { validationResult } from 'express-validator';
import { AssertionError } from 'assert';

export default class Routes {

    db: Database;

    constructor(dab: Database) {
        this.db = dab;
    }

    async updatePatientHandler(req: express.Request, 
                               res: express.Response, 
                               next: express.NextFunction): Promise<void> {
        const user = req.body;
        console.log("update this ...");
        console.log(user);
        try {
            console.log(`Referred from ${req.header('Referer')}\nNeed to update "${user.id}"`);
            checkValidationResults(req);

            if (user.forename === 'marty')
               throw {};

            await this.db.updatePatient(user);
            console.log("Done waiting...");
        }
        catch (err) {
            console.log("Caught exception during updatePatientHandler");
            console.log(err);
            console.log(`error keys has ${Object.keys(err).length}`);
            if (Object.keys(err).length === 0) {
                /* The keys are the input fields from the html form
                   and the catch all 'general' one.
                   If there are no keys it means an unexpected error
                   so use the express error handler to catch it.
                   */
                next(err);
                return;
            }

            return res.render('edit.html', {'user': user,
                                            'errors': err});
        }

        console.log("Calling redirect");
        return res.redirect('/users/list');
    }

    async createPatientForm(req: express.Request, res: express.Response): Promise<void> {
        const user: object = { dob: 'Sat Mar 01 2020 00:00:00'};
        return res.render('patient_new.html', {'user': user});
    }

    async createPatientHandler(req: express.Request, res: express.Response): Promise<void> {

        const user = req.body;
        let userId = undefined;
        try {
            //console.log(`Referred from ${req.header('Referer')}\nNeed to  "${user.forename}"`);
            console.log(`createPatientHandler forname = "${user.forename}"`);
            checkValidationResults(req);

            console.log(`creating patient`);
            console.log(user);
            userId = await this.db.createPatient(user);
            console.log(`created a patient with id ${userId}`);
        }
        catch (err) {
            console.log("Caught exception during createPatientHandler");
            console.log(err);
            return res.render('edit.html', {'user': user,
                                            'errors': err});
        }

        return res.redirect('/users/list');
    }

    async loadPatientHandler(req: express.Request, res: express.Response): Promise<void> {

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

    async listPatients(req: express.Request,
                       res: express.Response): Promise<void> {

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