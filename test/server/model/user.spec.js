var helper = require('../helper');
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');

describe("Users", function () {
    before(function (done) {
        helper.clearUser(done);
    });

    it("can be created", function (done) {
        var user = new User({
            email: 'foo@bar.com',
            password: 'foobar'
        });
        user.save(function (err, result) {
            should.not.exist(err);
            should.exist(result);
            result.email.should.equal('foo@bar.com');
            result.isAdmin.should.be.exactly(false);
            should.exist(result.password);
            done();
        })
    });

    it("should have an default admin", function (done) {

        User.findOne({'isAdmin': true}, function (err, admin) {
            should.not.exist(err);
            should.exist(admin);
            admin.email.should.equal('admin@admin.com');
            admin.isAdmin.should.be.exactly(true);
            done();
        });
    });

    it("has only one default admin", function (done) {
        var user = new User({
            email: 'seconAdmin@bar.com',
            password: 'foobar',
            isAdmin: true
        });
        user.save(function (err, result) {
            should.exist(err);
            done();
        })
    });
    it("should have a email", function (done) {
        var user = new User({
            email: '',
            password: 'foobar',
        });
        user.save(function (err, result) {
            should.exist(err);
            done();
        })
    });
    it("should have a valid email", function (done) {
        var user = new User({
            email: 'dfg6%dsf',
            password: 'foobar',
        });
        user.save(function (err, result) {
            should.exist(err);
            done();
        })
    });
    it("should have a password", function (done) {
        var user = new User({
            email: 'password@bar.com',
            password: '',
        });
        user.save(function (err, result) {
            should.exist(err);
            done();
        })
    });
});