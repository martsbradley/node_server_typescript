import express from 'express';
import Database  from './database';
import { checkSchema } from 'express-validator';
import Validation from './validation';
import {idParamSchema,UserSchema, NewUserSchema} from './schema';
import { validationResult } from 'express-validator';
import PageInfo from './pageInfo';
import {MedicineResult} from './user';
import Store from './store';

export default class UserRouter {
    router: express.Router;
    validation: Validation = new Validation();
    db: Store;

    constructor(db: Store) {
        this.router = express.Router();
        this.db = db;

        this.router.get('/new', 
                      this.createPatientForm.bind(this));

        this.router.get('/', 
                        checkSchema(idParamSchema),
                        this.loadPatientHandler.bind(this));

        this.router.get('/list', 
                         this.listPatients.bind(this));

        this.router.post('*', this.cancelHandler.bind(this));

        this.router.post('/new', 
                         checkSchema(NewUserSchema), 
                         this.createPatientHandler.bind(this));

        this.router.post('/', 
                         checkSchema(UserSchema),
                         this.updatePatientHandler.bind(this));

        this.router.get('/prescription/new',
                      this.createPrescriptionForm.bind(this));
    }

    cancelHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.log("Is this Post a cancel")

        const body = req.body;
      //console.log("body is");
      //console.log(body);
      //console.log("req keys");
      //console.log(Object.keys(req));

        if (body['Cancel'] === 'Cancel') {
            console.log("Cancel redirect...")
            res.redirect(req.baseUrl + '/list');
        } else {
            console.log("Continue the Post processing.")
            next();
        }
    }


    async createPrescriptionForm(req: express.Request, res: express.Response): Promise<void> {
        const { page = 1, pageSize = 5, nameFilter= '' } = req.query;

        const pageInfo = new PageInfo(page, pageSize, nameFilter);
        
        console.log("making user form...");
        const user: object = { dob: 'Sat Mar 01 2020 00:00:00'};

        const medicines: MedicineResult = await this.db.loadMedicines(pageInfo);

        pageInfo.dataSize = medicines.total;

        res.set('Cache-Control', 'max-age=300, private');

        return res.render('prescription_new.html', {'medicines': medicines.data,
                                                    'pageInfo': pageInfo,
                                                    'totalMeds': medicines.total});
    }

    async createPatientForm(req: express.Request, res: express.Response): Promise<void> {
        console.log("making user form...");
        const user: object = { dob: 'Sat Mar 01 2020 00:00:00'};
        return res.render('patient_new.html', {'user': user});
    }

    async updatePatientHandler(req: express.Request, 
                               res: express.Response, 
                               next: express.NextFunction): Promise<void> {
        const user = req.body;
        console.log("update this ...");
        console.log(user);
        try {
            console.log(`Referred from ${req.header('Referer')}\nNeed to update "${user.id}"`);
            this.validation.checkValidationResults(req);

            if (user.forename === 'marty')
            {
                throw {};
            }

            await this.db.updatePatient(user);
            console.log("Finished updatePatientHandler processing");
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

        return res.redirect('/user/list');
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

    async createPatientHandler(req: express.Request, res: express.Response): Promise<void> {

        const user = req.body;
        let userId = undefined;
        try {
            //console.log(`Referred from ${req.header('Referer')}\nNeed to  "${user.forename}"`);
            console.log(`createPatientHandler forname = "${user.forename}"`);

            console.log(`creating patient`);
            console.log(user);
            userId = await this.db.createPatient(user);
            console.log(`created a patient with id ${userId}`);
        }
        catch (err) {
            console.log("Caught exception during createPatientHandler");
            console.log(err);

                            //patient_new.html
            return res.render('edit.html', {'user': user,
                                            'errors': err});
        }

        return res.redirect('/user/list');
    }


    async listPatients(req: express.Request,
                       res: express.Response): Promise<void> {
        const { page = 1, pageSize = 5, nameFilter= '' } = req.query;

        const pageInfo = new PageInfo(page, pageSize, nameFilter);

        const patients = await this.db.queryAllPatients(pageInfo);
        pageInfo.dataSize =  patients.total;

        const data = { 'users': patients.data, 
                       'pageInfo': pageInfo};

        return res.render('home.html', data);
    }
}