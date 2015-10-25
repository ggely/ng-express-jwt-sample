var mongoose = require('mongoose');
var should = require('should');
process.env.NODE_ENV = 'test';
var app = require('../../server/server');
var User = mongoose.model('User');
var jwt = require('jwt-simple');
var config = require('../../server/config/config');

module.exports.clearUser = function (done) {
    User.find({'isAdmin': false}).remove(done);
};
module.exports.app = app;
module.exports.createOAuthToken = function (email, password) {
    return 'Bearer ' + jwt.encode({email: email, hashed_password: password}, config.tokenSecret);
};
module.exports.createToken = function ( email, password) {
    return '' + jwt.encode({email: email, hashed_password: password}, config.tokenSecret);
};

