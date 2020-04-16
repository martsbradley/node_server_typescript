import Server  from './server';
import request  from 'supertest';
import Database  from './database'; 
import nunjucks from 'nunjucks';

describe('Server',  function() {
    let  db: Database;
    let  server: Server = null;

    const newUserURL         = '/user/new';
    const addPrescriptionURL = '/user/prescription/new';
    const updateUserURL      = '/user';
    const listUsersURL       = '/user/list';

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

    it('Positive: New Patient Form', function(done) {
        request(server.express)
            .get(newUserURL)
            .end(function(err, res) {
                expect(res.text).toContain('<h1>New Patient</h1>');
                expect(res.header['content-type']).toEqual("text/html; charset=utf-8");
                expect(res.status).toEqual(200);
                done();
            });
    });

    it('Positive: Display New Prescription Page', function(done) {
        request(server.express)
            .get(addPrescriptionURL)
            .end(function(err, res) {
                expect(res.status).toEqual(200);
                expect(res.text).toContain('<h1>Add Prescription</h1>');
                expect(res.header['content-type']).toEqual("text/html; charset=utf-8");
                done();
            });
    });

    it('Positive: List Patients', function(done) {
        request(server.express)
            .get(listUsersURL)
            .end(function(err, res) {
                expect(res.text).toContain('<h1>List Patients</h1>');

                expect(res.text).toContain('<h1>List Patients</h1>');
                expect(res.text).toContain("<a href='/user/new'>New Patient</a>");

                expect(res.header['content-type']).toEqual("text/html; charset=utf-8");
                expect(res.status).toEqual(200);
                done();
            });
    });

    it('Negative Post update an unknown', function(done) {
        const unknownId: number = undefined;
        request(server.express)
            .post(updateUserURL)
            .send({id: unknownId,
                   forename: 'Some', 
                   surname: 'Buddy',
                   sex: 'Male'})
            .end(function(err, res) {
                expect(res.status).toEqual(200);
                expect(res.header['content-type']).toEqual("text/html; charset=utf-8");
                expect(res.text).toContain('Unknown issue');
                done();
            });
    });

    it('Positive New User', function(done) {
        const unknownId: number = undefined;
        request(server.express)
            .post(newUserURL)
            .send({id: unknownId,
                   forename: 'Some', 
                   surname: 'Buddy',
                   sex: 'Male',
                   dateOfBirth: '2011-10-01'})
            .end(function(err, res) {
                console.log("ok checking now");
                console.log(res.text);
                expect(res.status).toEqual(302);
                expect(res.header['content-type']).toEqual("text/plain; charset=utf-8");
                expect(res.text).toContain('Found. Redirecting to /user/list');
                done();
            });
    });
});