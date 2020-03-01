import Server  from './server';
import request  from 'supertest';
import Database  from './databaseInterface'; 
import nunjucks from 'nunjucks';

describe('API Tests',  function() {
    let  db: Database;
    let  server: Server = null;
    beforeAll(() => {
        db = new Database();
        server = new Server(db);

        nunjucks.configure('template', {
            autoescape: true,
            express: server.express,
        });
    })

    afterAll(() => {
        db.closeDatabase();
    });

    it('test2', function(done) {
        request(server.express)
            .get('/user/list')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log("Here done yea");
                console.log(res);
                done();
            });
    });
});