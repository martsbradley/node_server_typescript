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

export default class PrescriptionRoute {
    router: express.Router;
    validation: Validation = new Validation();
    db: Store;

    constructor(db: Store) {
        this.router = express.Router();
        this.db = db;

        this.router.get('/', 
                         this.listMedicines.bind(this));
        this.router.post('/',
                         this.createPrescription.bind(this));

        this.router.delete('/prescription/:prescriptionId',
                         this.deletePrescription.bind(this));
    }

    async listMedicines(req: express.Request, res: express.Response): Promise<void> {
        console.log("listMedicines");
        const { page = '1', pageSize = '5', filter = '' } = req.query;

        const p = Number(page);
        const s = Number(pageSize);

        const f = String(filter);

        const pageInfo = new PageInfo(p, s, f);
        
        const medicines: MedicineResult = await this.db.loadMedicines(pageInfo);

        pageInfo.dataSize = medicines.total;

        const data = {'medicines': medicines.data,
                      'pageInfo': pageInfo};

        res.status(200).json(data);
    }

    async createPrescription(req: express.Request, res: express.Response): Promise<void> {
        const prescription = req.body.prescription;
        const patientId    = req.body.patientId;
        const id = await this.db.createPrescription(patientId, prescription);

        res.status(200).json({prescriptionId: id});
    }

    async deletePrescription(req: express.Request, res: express.Response): Promise<void> {
      
        const prescriptionId = Number(req.params.prescriptionId);
        console.log(`Server needs to delete ${prescriptionId}`);

        await this.db.deletePrescription(prescriptionId);

        res.status(200).json({data: [1,2,3]});
    }
}
