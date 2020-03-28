import express = require('express');
import Database  from './database';
import { checkSchema } from 'express-validator';
import Routes from './routes';

import { idParamSchema, NewUserSchema, UserSchema} from './validation';



export default class Server {

    db: Database;
    express: express.Express;
    routes: Routes;

    constructor(db: Database) {
        this.db = db;
        this.express = express();

        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.static('public'))

        this.routes = new Routes(this.db);

        // Endpoint for new user form
        this.express.get('/user/new', 
                         checkSchema(NewUserSchema), 
                         this.createPatientForm.bind(this));

        // Endpoint for creating new users.
        this.express.post('/user/new', 
                         checkSchema(NewUserSchema), 
                         this.createPatientHandler.bind(this));

        // Endpoint for modifying users.
        this.express.post('/user', 
                         checkSchema(UserSchema), 
                         this.updatePatientHandler.bind(this));

        // Edit individual User.
        this.express.get('/user', 
                        checkSchema(idParamSchema),
                        this.loadPatientHandler.bind(this));

        this.express.get('/users/list', 
                         this.listPatients.bind(this));

        this.express.use(function (err: object, req: express.Request, res: express.Response, _nextIgnored: express.NextFunction) {
            console.error("Here in the handler");
            console.error(err)
            res.status(500).send('Server 500: Unexpected Error')
        });
    }

    listen(port: number): void{
        console.log(`This ${port} opening...`)
        console.log(`By ${this.express}`)
        this.express.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }

    updatePatientHandler(req: express.Request, res: express.Response, next: express.NextFunction): void{
        this.routes.updatePatientHandler(req, res, next);
    }

    loadPatientHandler(req: express.Request, res: express.Response): void{
        this.routes.loadPatientHandler(req, res);
    }

    listPatients(req: express.Request, res: express.Response): void{
        this.routes.listPatients(req, res);
    }

    createPatientHandler(req: express.Request, res: express.Response): void{
        this.routes.createPatientHandler(req, res);
    }

    createPatientForm(req: express.Request, res: express.Response): void{
        this.routes.createPatientForm(req, res);
    }
}