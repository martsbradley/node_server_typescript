import express = require('express');
import Database  from './databaseInterface';
import { checkSchema } from 'express-validator';
import Routes from './routes';

import { idParamSchema, userSchema} from './validation';


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

        this.express.post('/user/save', 
                         checkSchema(userSchema), 
                         this.saveHandler.bind(this));

        this.express.get('/user/edit', 
                        checkSchema(idParamSchema),
                        this.editHandler.bind(this));

        this.express.get('/user/list', 
                         this.listHandler.bind(this));
    }

    listen(port: number){
        console.log(`This ${port} opening...`)
        console.log(`By ${this.express}`)
        this.express.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }

    saveHandler(req: express.Request, res: express.Response){
        console.log("fdsa");
        this.routes.saveHandler(req, res);
    }
    editHandler(req: express.Request, res: express.Response){
        this.routes.editHandler(req, res);
    }
    listHandler(req: express.Request, res: express.Response){
        console.log("listHandler");
        this.routes.listHandler(req, res);
    }
}