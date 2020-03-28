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

    it('List Patients', function(done) {
        request(server.express)
            .get('/users/list')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                done();
            });
    });

    it('Negative Post /user/ modify an unknown', function(done) {
        const unknownId: number = undefined;
        request(server.express)
            .post('/user/')
            .send({id: unknownId,
                   forename: 'Some', 
                   surname: 'Buddy',
                   sex: 'Male'})
            .end(function(err, res) {
                expect(res.status).toEqual(500);
                expect(res.text).toContain('Unexpected Error');
                expect(res.header['content-type']).toEqual("text/html; charset=utf-8");
                done();
            });
    });

    it('Positive Post /user/new', function(done) {
        const unknownId: number = undefined;
        request(server.express)
            .post('/user/new')
            .send({id: unknownId,
                   forename: 'Some', 
                   surname: 'Buddy',
                   sex: 'Male',
                   dob: 'Sat Jan 01 2011 00:00:00'})
            .end(function(err, res) {
                console.log("ok checking now");
                console.log(res.text);
                expect(res.text).toContain('Found. Redirecting to /users/list');
                expect(res.status).toEqual(302);
                expect(res.header['content-type']).toEqual("text/plain; charset=utf-8");
                done();
            });
    });
});