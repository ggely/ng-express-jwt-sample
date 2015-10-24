var helper = require('../helper');
var request = require('supertest');

describe('Users', function () {
    describe('POST /api/users/login', function () {
        it('400 if email not given', function (done) {
            request(helper.app)
                .post('/api/users/login')
                .send({password: 'admin'})
                .expect(400)
                .end(done)
        });
        it('400 if password not given', function (done) {
            request(helper.app)
                .post('/api/users/login')
                .send({email: 'admin@admin.com'})
                .expect(400)
                .end(done)
        });
        it('401 if password are wrong', function (done) {
            request(helper.app)
                .post('/api/users/login')
                .send({email: 'admin@admin.com',password: 'fsdf'})
                .expect(401)
                .end(done)
        });
        it('401 if email unexisted', function (done) {
            request(helper.app)
                .post('/api/users/login')
                .send({email: 'adminffrr@admin.com',password: 'admin'})
                .expect(401)
                .end(done)
        });
        it('can login', function (done) {
            request(helper.app)
                .post('/api/users/login')
                .send({email: 'admin@admin.com',password: 'admin'})
                .expect(200)
                .end(done)
        });
    })
});
