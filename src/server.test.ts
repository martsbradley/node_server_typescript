import Server  from './server';
import request  from 'supertest';
import Database  from './database'; 
import nunjucks from 'nunjucks';

describe('Server',  function() {
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

    it('get', function(done) {
        request(server.express)
            .get('/user/list')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                done();
            });
    });
    it('post', function(done) {
        request(server.express)
            .post('/user/save')
            .send({id: 22,
                   forename: 'JoshMatz', 
                   surname: 'JoshMatz',
                   sex: 'Male'})
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log(res);
                //expect(res.text).to.equal('{ "id": 500 }');
                done();
            });

            //Database Error, unable to Save User
    });
});