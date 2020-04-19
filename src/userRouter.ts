import express from 'express';
import Database  from './database';
import { checkSchema } from 'express-validator';
import Validation from './validation';
import {idParamSchema,UserSchema, NewUserSchema} from './schema';
import { validationResult } from 'express-validator';
import PageInfo from './pageInfo';
import {MedicineResult} from './user';
import Store from './store';
import * as core from "express-serve-static-core";

export default class UserRouter {
    router: express.Router;
    validation: Validation = new Validation();
    db: Store;

    constructor(db: Store) {
        this.router = express.Router();
        this.db = db;


        this.router.get('/', 
                        checkSchema(idParamSchema),
                        this.loadPatientHandler.bind(this));

        this.router.get('/list', 
                         this.listPatients.bind(this));


        this.router.post('/new', 
                         checkSchema(NewUserSchema), 
                         this.validation.middle(),
                         this.createPatientHandler.bind(this));

        this.router.put('/', 
                        checkSchema(UserSchema),
                        this.validation.middle(),
                        this.updatePatientHandler.bind(this));

        this.router.get('/prescription/new',
                      this.createPrescriptionForm.bind(this));
    }


  //storePreviousPage(req: express.Request, res: express.Response, next: express.NextFunction): void {
  //    const lastPage = req.header('Referer');
  //    console.log(`Setting cookie as ${lastPage}`);
  //    res.cookie('lastPage', lastPage, { expires: new Date(Date.now() + 900000), httpOnly: true })
  //    // TODO some validation
  //    next();
  //}

  //cancelHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
  //    console.log("Is this Post a cancel")

  //    const body = req.body;

  //    if (body['Cancel'] === 'Cancel') {
  //        const lastPage= req.cookies['lastPage'];
  //        console.log(`Cancel redirect = ${lastPage}`)

  //        // TODO
  //        // some validation

  //        res.redirect(lastPage);
  //    } else {
  //        console.log("Continue the Post processing.")
  //        next();
  //    }
  //}

  getPageInfo(query: core.Query): PageInfo {
    const { page = '1', pageSize = '5', nameFilter = '' } = query;

    const p = Number(page);
    const s = Number(pageSize);

    const f = String(nameFilter);

    const pageInfo = new PageInfo(p, s, f);
    return pageInfo;
  }

    async createPrescriptionForm(req: express.Request, res: express.Response): Promise<void> {
        const { page = '1', pageSize = '5', nameFilter = '' } = req.query;

        const p = Number(page);
        const s = Number(pageSize);

        const f = String(nameFilter);

        const pageInfo = new PageInfo(p, s, f);
        
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
        res.setHeader('Content-Type', 'application/json');

        console.log('Cookies: ', req.cookies)

        console.log(user);
        try {

            await this.db.updatePatient(user);
            console.log("Finished updatePatientHandler processing");
            res.status(200).json({});
        }
        catch (err) {
            if (this.unhandledError(err)){
                next(err);
                return;
            }
            res.status(404);
        }
    }

    async createPatientHandler(req: express.Request, 
                               res: express.Response, 
                               next: express.NextFunction): Promise<void> {
        res.setHeader('Content-Type', 'application/json');

        const user = req.body;
        console.log("createPatientHandler");
        console.log(user);
        try {

            const userId = await this.db.createPatient(user);
            console.log(`created a patient with id ${userId}`);
        }
        catch (err) {
            if (this.unhandledError(err)){
                //next(err);
                res.status(404).json(err);
                return;
            }
            res.status(404).json(err);
            return;
        }

        res.status(200).json({});
        return;
    }

    async loadPatientHandler(req: express.Request, res: express.Response): Promise<void> {

        const errors = validationResult(req);
        res.setHeader('Content-Type', 'application/json');

        if (!errors.isEmpty()) {
            console.log(errors);
            res.status(401).json(JSON.stringify(errors, null, 3));
        }

        const id = parseInt(req.query.id as string, 10);
        console.log(`Handling the /user/edit/${id}`);

        const user = await this.db.queryUser(id);
        const data = {'user': user};

        if (!user) {
            console.log(`User id ${id} not found`);
            res.status(404)
        }

        res.status(200).json(user);
    }

    async listPatients(req: express.Request,
                       res: express.Response): Promise<void> {

        console.log("here in list patients");
        const pageInfo = this.getPageInfo(req.query); //new PageInfo(page, pageSize, nameFilter);
            

        const patients = await this.db.queryAllPatients(pageInfo);
        pageInfo.dataSize =  patients.total;

        const data = { 'users': patients.data, 
                       'pageInfo': pageInfo};

        res.setHeader('Content-Type', 'application/json');
        console.log("return in list patients");

        res.status(200).json(data);
    }
}
