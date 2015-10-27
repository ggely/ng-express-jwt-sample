var mongoose = require('mongoose');
var should = require('should');
process.env.NODE_ENV = 'test';
var app = require('../../server/server');
var User = mongoose.model('User');
var jwt = require('jwt-simple');
var config = require('../../server/config/config');

var adminToken;

getAdminToken = function () {
    return adminToken;
};

createOAuthToken = function (id, email) {
    return 'Bearer ' + jwt.encode({_id: id, email: email}, config.tokenSecret);
};

module.exports.clearUser = function (done) {
    User.find({'isAdmin': false}).remove(done);
};
module.exports.waitInit = function (done) {

    var createAdminToken = function () {
        User.findOne({'isAdmin': true}, function (err, user) {
            adminToken = createOAuthToken(user._id, 'admin@admin.com');
            done();
        });
    };

    setTimeout(function () {
        createAdminToken();
    }, 1000);
};

module.exports.app = app;
module.exports.getAdminToken = getAdminToken;
module.exports.createOAuthToken = createOAuthToken;
