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

        this.router.get('*', this.storePreviousPage.bind(this));

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
                         this.validation.middle('patient_new.html'),
                         this.createPatientHandler.bind(this));

        this.router.post('/', 
                         checkSchema(UserSchema),
                         this.validation.middle('edit.html'),
                         this.updatePatientHandler.bind(this));

        this.router.get('/prescription/new',
                      this.createPrescriptionForm.bind(this));
    }


    storePreviousPage(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const lastPage = req.header('Referer');
        console.log(`Setting cookie as ${lastPage}`);
        res.cookie('lastPage', lastPage, { expires: new Date(Date.now() + 900000), httpOnly: true })
        // TODO some validation
        next();
    }

    cancelHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.log("Is this Post a cancel")

        const body = req.body;

        if (body['Cancel'] === 'Cancel') {
            const lastPage= req.cookies['lastPage'];
            console.log(`Cancel redirect = ${lastPage}`)

            // TODO
            // some validation

            res.redirect(lastPage);
        } else {
            console.log("Continue the Post processing.")
            next();
        }
    }

    async createPrescriptionForm(req: express.Request, res: express.Response): Promise<void> {
        const { page = 1, pageSize = 5, nameFilter= '' } = req.query;

        const pageInfo = new PageInfo(page, pageSize, nameFilter);
        
        console.log("making user form...");

        const medicines: MedicineResult = await this.db.loadMedicines(pageInfo);

        pageInfo.dataSize = medicines.total;

        //res.set('Cache-Control', 'max-age=300, private');

        return res.render('prescription_new.html', {'medicines': medicines.data,
                                                    'pageInfo': pageInfo,
                                                    'totalMeds': medicines.total});
    }

    async createPatientForm(req: express.Request, res: express.Response): Promise<void> {
        console.log("making user form...");
        const user: object = { sex: 'Male', 
                               dateOfBirth: 'Sat Mar 01 2020 00:00:00'};
        return res.render('patient_new.html', {'user': user});
    }

    /* The keys are the input fields from the html form
        and the catch all 'general' one.
        If there are no keys it means an unexpected error
        so use the express error handler to catch it.
        */
    private unhandledError(err: object): boolean {
        console.log(err);
        return (Object.keys(err).length === 0);
    }

    async updatePatientHandler(req: express.Request, 
                               res: express.Response, 
                               next: express.NextFunction): Promise<void> {
        const user = req.body;
        console.log("updatePatientHandler");

        console.log('Cookies: ', req.cookies)

        console.log(user);
        try {

            await this.db.updatePatient(user);
            console.log("Finished updatePatientHandler processing");
        }
        catch (err) {
            if (this.unhandledError(err)){
                next(err);
                return;
            }

            return res.render('edit.html', {'user': user,
                                            'errors': err});
        }

        return res.redirect('/user/list');
    }

    async createPatientHandler(req: express.Request, 
                               res: express.Response, 
                               next: express.NextFunction): Promise<void> {
        const user = req.body;
        console.log("createPatientHandler");
        console.log(user);
        try {

            const userId = await this.db.createPatient(user);
            console.log(`created a patient with id ${userId}`);
        }
        catch (err) {
            if (this.unhandledError(err)){
                next(err);
                return;
            }
            return res.render('patient_new.html', {'user': user,
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