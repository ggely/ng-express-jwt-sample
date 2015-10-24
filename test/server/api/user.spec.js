var helper = require('../helper');
var request = require('supertest');
var mongoose = require('mongoose');
var User = mongoose.model('User');

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
                .send({email: 'admin@admin.com', password: 'fsdf'})
                .expect(401)
                .end(done)
        });
        it('401 if email unexisted', function (done) {
            request(helper.app)
                .post('/api/users/login')
                .send({email: 'adminffrr@admin.com', password: 'admin'})
                .expect(401)
                .end(done)
        });
        it('can login', function (done) {
            request(helper.app)
                .post('/api/users/login')
                .send({email: 'admin@admin.com', password: 'admin'})
                .expect(function (res) {
                    return typeof res.auh_token !== 'undefined';
                })
                .end(done)
        });
        after(function (done) {
            helper.clearUser(done);
        });
    });
    describe('GET /api/users', function () {
        it('401 if not logged', function (done) {
            request(helper.app)
                .get('/api/users')
                .send()
                .expect(401)
                .end(done)
        });
        it('403 if not admin', function (done) {
            var user = new User({
                email: 'foo2@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .get('/api/users')
                    .set('auth_token', helper.createToken('foo2@test.com', 'foobar'))
                    .send()
                    .expect(403)
                    .end(done)
            });
        });
        it('get number of non admin users', function (done) {
            var user = new User({
                email: 'foo3@bar.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .get('/api/users')
                    .set('auth_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImhhc2hlZF9wYXNzd29yZCI6Ikk2VTYyVGpmQkNaQWVpd0VRNHBmNW5mdFFMdEs0Z01ZaWNUUUJpQkMyUWVUZUM0eDdXVG9iU1VUZVFWc1hxeDFJNW9OalhJS3RCbTJMRm85YUxkcHNRPT0ifQ.mpWMmjhNP5JTgS15UC4H7ifTXaFpo2HNJhT5CwoQPHg')
                    .send()
                    .expect(function (res) {
                        return res.body.length == 1;
                    })
                    .end(done)
            });
        });
        after(function (done) {
            helper.clearUser(done);
        });
    });
    describe('GET /api/users/{:id}', function () {
        var id;
        before(function (done) {
            var user = new User({
                email: 'foo2@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                id = result._id;
                done()
            })
        });
        it('401 if not logged', function (done) {
            request(helper.app)
                .get('/api/users/' + id)
                .send()
                .expect(401)
                .end(done)
        });
        it('403 if not admin', function (done) {
            var user = new User({
                email: 'foo2@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .get('/api/users/' + id)
                    .set('auth_token', helper.createToken('foo2@test.com', 'foobar'))
                    .send()
                    .expect(403)
                    .end(done)
            });
        });
        it('get the user', function (done) {
            request(helper.app)
                .get('/api/users/' + id)
                .set('auth_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImhhc2hlZF9wYXNzd29yZCI6Ikk2VTYyVGpmQkNaQWVpd0VRNHBmNW5mdFFMdEs0Z01ZaWNUUUJpQkMyUWVUZUM0eDdXVG9iU1VUZVFWc1hxeDFJNW9OalhJS3RCbTJMRm85YUxkcHNRPT0ifQ.mpWMmjhNP5JTgS15UC4H7ifTXaFpo2HNJhT5CwoQPHg')
                .send()
                .expect({"_id":id+'',"isAdmin":false,"email":"foo2@test.com"})
                .end(done)
        });
        after(function (done) {
            helper.clearUser(done);
        });
    });
    describe('POST /api/users', function () {
        var id;
        before(function (done) {
            var user = new User({
                email: 'foo2@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                id = result._id;
                done()
            })
        });
        it('401 if not logged', function (done) {
            request(helper.app)
                .post('/api/users')
                .send()
                .expect(401)
                .end(done)
        });
        it('403 if not admin', function (done) {
            var user = new User({
                email: 'foo2@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .post('/api/users')
                    .set('auth_token', helper.createToken('foo2@test.com', 'foobar'))
                    .send()
                    .expect(403)
                    .end(done)
            });
        });
        it('create the user', function (done) {
            request(helper.app)
                .post('/api/users')
                .set('auth_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImhhc2hlZF9wYXNzd29yZCI6Ikk2VTYyVGpmQkNaQWVpd0VRNHBmNW5mdFFMdEs0Z01ZaWNUUUJpQkMyUWVUZUM0eDdXVG9iU1VUZVFWc1hxeDFJNW9OalhJS3RCbTJMRm85YUxkcHNRPT0ifQ.mpWMmjhNP5JTgS15UC4H7ifTXaFpo2HNJhT5CwoQPHg')
                .send({
                    email: 'test@test.com',
                    password: 'test'
                })
                .expect(function(res) {
                    res.body._id = 'id';
                })
                .expect({
                    '_id':'id',
                    email: 'test@test.com',
                    isAdmin: false
                })
                .end(done)
        });
        it('create the user and admin field in immutable', function (done) {
            request(helper.app)
                .post('/api/users')
                .set('auth_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImhhc2hlZF9wYXNzd29yZCI6Ikk2VTYyVGpmQkNaQWVpd0VRNHBmNW5mdFFMdEs0Z01ZaWNUUUJpQkMyUWVUZUM0eDdXVG9iU1VUZVFWc1hxeDFJNW9OalhJS3RCbTJMRm85YUxkcHNRPT0ifQ.mpWMmjhNP5JTgS15UC4H7ifTXaFpo2HNJhT5CwoQPHg')
                .send({
                    email: 'test2@test.com',
                    password: 'test',
                    isAdmin: true
                })
                .expect(function(res) {
                    res.body._id = 'id';
                })
                .expect({
                    '_id':'id',
                    email: 'test2@test.com',
                    isAdmin: false
                })
                .end(done)
        });
        after(function (done) {
            helper.clearUser(done);
        });
    })
});
