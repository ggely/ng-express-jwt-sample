var helper = require('../helper');
var request = require('supertest');
var mongoose = require('mongoose');
var User = mongoose.model('User');

describe('Users', function (done) {
    before(function (done) {
        helper.waitInit(done);
    });

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
                .expect(200)
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
                    .set('Authorization', helper.createOAuthToken(result._id, 'foo2@test.com', 'foobar'))
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
                    .set('Authorization', helper.getAdminToken())
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
                email: 'secondAdmin@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .get('/api/users/' + id)
                    .set('Authorization', helper.createOAuthToken(result._id, 'secondAdmin@test.com'))
                    .send()
                    .expect(403)
                    .end(done)
            });
        });
        it('get the user', function (done) {
            request(helper.app)
                .get('/api/users/' + id)
                .set('Authorization', helper.getAdminToken())
                .send()
                .expect({"_id": id + '', "isAdmin": false, "email": "foo2@test.com"})
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
                email: 'notadmin@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .post('/api/users')
                    .set('Authorization', helper.createOAuthToken(result._id, 'notadmin@test.com'))
                    .send()
                    .expect(403)
                    .end(done)
            });
        });
        it('create the user', function (done) {
            request(helper.app)
                .post('/api/users')
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'test@test.com',
                    password: 'test'
                })
                .expect(function (res) {
                    res.body._id = 'id';
                })
                .expect({
                    '_id': 'id',
                    email: 'test@test.com',
                    isAdmin: false
                })
                .end(done)
        });
        it('create the user and admin field in immutable', function (done) {
            request(helper.app)
                .post('/api/users')
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'test2@test.com',
                    password: 'test',
                    isAdmin: true
                })
                .expect(function (res) {
                    res.body._id = 'id';
                })
                .expect({
                    '_id': 'id',
                    email: 'test2@test.com',
                    isAdmin: false
                })
                .end(done)
        });
        it('failed if email exist', function (done) {
            var user = new User({
                email: 'existing@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .post('/api/users')
                    .set('Authorization', helper.getAdminToken())
                    .send({
                        email: 'existing@test.com',
                        password: 'foobar'
                    })
                    .expect(500)
                    .end(done)
            });
        });
        it('failed if email invalid', function (done) {
            request(helper.app)
                .post('/api/users')
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'invalid@test',
                    password: 'foobar'
                })
                .expect(500)
                .end(done)
        });
        it('failed if email password <= 4', function (done) {
            request(helper.app)
                .post('/api/users')
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'toohort@test',
                    password: 'foo'
                })
                .expect(500)
                .end(done)
        });
        it('failed if email password => 16', function (done) {
            request(helper.app)
                .post('/api/users')
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'toolong@test',
                    password: '12345678901234567'
                })
                .expect(500)
                .end(done)
        });
        after(function (done) {
            helper.clearUser(done);
        });
    });
    describe('POST /api/users/{:id}', function () {
        var id;
        before(function (done) {
            var user = new User({
                email: 'test@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                id = result._id;
                done()
            })
        });
        it('401 if not logged', function (done) {
            request(helper.app)
                .post('/api/users/' + id)
                .send()
                .expect(401)
                .end(done)
        });
        it('403 if not admin', function (done) {
            var user = new User({
                email: 'notAdmin@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .post('/api/users/' + id)
                    .set('Authorization', helper.createOAuthToken(result._id, 'notAdmin@test.com'))
                    .send()
                    .expect(403)
                    .end(done)
            });
        });
        it('Modify the user', function (done) {
            request(helper.app)
                .post('/api/users/' + id)
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'test@test.com',
                    password: 'test'
                })
                .expect({
                    '_id': id + '',
                    email: 'test@test.com',
                    isAdmin: false
                })
                .end(done)
        });
        it('Modify the user and admin field in immutable', function (done) {
            request(helper.app)
                .post('/api/users/' + id)
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'immutableAdmin@test.com',
                    password: 'test',
                    isAdmin: true
                })
                .expect({
                    '_id': id + '',
                    email: 'immutableAdmin@test.com',
                    isAdmin: false
                })
                .end(done)
        });
        it('failed if email exist and not the same', function (done) {
            var user = new User({
                email: 'existing@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .post('/api/users/' + id)
                    .set('Authorization', helper.getAdminToken())
                    .send({
                        email: 'existing@test.com',
                        password: 'foobar'
                    })
                    .expect(500)
                    .end(done)
            });
        });
        it('Success if email is the same', function (done) {
            var user = new User({
                email: 'sameEmail@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .post('/api/users/' + result._id)
                    .set('Authorization', helper.getAdminToken())
                    .send({
                        email: 'sameEmail@test.com',
                        password: 'test'
                    })
                    .expect({
                        '_id': result._id + '',
                        email: 'sameEmail@test.com',
                        isAdmin: false
                    })
                    .end(done)
            });
        });
        it('Success if password not provide, keep the same', function (done) {
            var validate = function () {
                request(helper.app)
                    .post('/api/users/login')
                    .send({
                        email: 'samePassword2@test.com',
                        password: 'foobar'
                    })
                    .expect(200)
                    .end(done)
            };

            var user = new User({
                email: 'samePassword@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .post('/api/users/' + result._id)
                    .set('Authorization', helper.getAdminToken())
                    .send({
                        email: 'samePassword2@test.com'
                    })
                    .expect()
                    .end(validate)
            });
        });
        it('failed if email invalid', function (done) {
            request(helper.app)
                .post('/api/users/' + id)
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'invalid@test',
                    password: 'foobar'
                })
                .expect(500)
                .end(done)
        });
        it('failed if email password <= 4', function (done) {
            request(helper.app)
                .post('/api/users/' + id)
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'toohort@test',
                    password: 'foo'
                })
                .expect(500)
                .end(done)
        });
        it('failed if email password => 16', function (done) {
            request(helper.app)
                .post('/api/users/' + id)
                .set('Authorization', helper.getAdminToken())
                .send({
                    email: 'toolong@test',
                    password: '12345678901234567'
                })
                .expect(500)
                .end(done)
        });
        after(function (done) {
            helper.clearUser(done);
        });
    });
    describe('POST /api/users/:id/cities', function () {
        it('addCity', function (done) {
            var user = new User({
                email: 'user@test.com',
                password: 'foobar'
            });
            user.save(function (err, result) {
                request(helper.app)
                    .post('/api/users/' + result._id + '/cities')
                    .set('Authorization', helper.createOAuthToken(result._id, 'user@test.com'))
                    .send({
                        ref: 2980586,
                        name: "Sainte-Foy-les-Lyon",
                        country: "FR",
                        coord: {
                            lon: 4.79688,
                            lat: 45.736919
                        }
                    })
                    .expect(200)
                    .expect(function (res) {
                        res.body._id = 'id';
                    })
                    .expect({
                        _id: 'id',
                        ref: 2980586,
                        name: "Sainte-Foy-les-Lyon",
                        country: "FR",
                        coord: {
                            lon: 4.79688,
                            lat: 45.736919
                        }
                    })
                    .end(done)
            });
        });
        after(function (done) {
            helper.clearUser(done);
        });
    });
    describe('GET /api/users/:id/cities', function () {
        it('addCity', function (done) {
            var user = new User({
                email: 'user@test.com',
                password: 'foobar'
            });
            var user_id;

            var addCity = function (cb) {
                request(helper.app)
                    .post('/api/users/' + user_id + '/cities')
                    .set('Authorization', helper.createOAuthToken(user_id, 'user@test.com'))
                    .send({
                        ref: 2980586,
                        name: "Sainte-Foy-les-Lyon",
                        country: "FR",
                        coord: {
                            lon: 4.79688,
                            lat: 45.736919
                        }
                    })
                    .end(cb)
            };

            var getCities = function () {
                request(helper.app)
                    .get('/api/users/' + user_id + '/cities')
                    .set('Authorization', helper.createOAuthToken(user_id, 'user@test.com'))
                    .send()
                    .expect(200)
                    .expect(function (res) {
                        res.body[0]._id = 'id';
                    })
                    .expect([{
                        _id: 'id',
                        ref: 2980586,
                        name: "Sainte-Foy-les-Lyon",
                        country: "FR",
                        coord: {
                            lon: 4.79688,
                            lat: 45.736919
                        }
                    }])
                    .end(done)
            };

            user.save(function (err, result) {
                user_id = result._id;
                addCity( getCities);

            });
        });
        after(function (done) {
            helper.clearUser(done);
        });
    });

});
