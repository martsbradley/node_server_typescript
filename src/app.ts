import Server from './server';
import nunjucks from 'nunjucks';
import Database  from './databaseInterface'; 

const db: Database = new Database();
const server = new Server(db);

nunjucks.configure('template', {
    autoescape: true,
    express: server.express,
    watch: true
});

const port = 3000;
server.listen(port);