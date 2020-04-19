import Server from './server';
import Database  from './database'; 

const db: Database = new Database();
const server = new Server(db);

const port = 3001;
server.listen(port);
