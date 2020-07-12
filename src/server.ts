import express = require('express');
import Database  from './database';
import UserRoutes from './userRouter';
import AuthVerify from './authVerify';
import cookieParser from 'cookie-parser';
import PrescriptionRoute from './prescriptionRoute';

export default class Server {

    db: Database;
    express: express.Express;

    constructor(db: Database) {
        this.db = db;
        this.express = express();

        this.express.use(express.static('public'))
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.static('public'))
        this.express.use(cookieParser());

        this.express.use('/auth/', new AuthVerify(this.db).router);
        this.express.use('/user/', new UserRoutes(this.db).router);
        this.express.use('/meds/', new PrescriptionRoute(this.db).router);
             
        this.express.use(function (err: object, req: express.Request, res: express.Response, _nextIgnored: express.NextFunction) {
            //console.error("Here in the handler");
            //console.error(err)
            res.status(500).send('Server 500: Unexpected Error')
        });
    }

    listen(port: number): void{
        //console.log(`This ${port} opening...`)
        //console.log(`By ${this.express}`)
        this.express.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }
}
