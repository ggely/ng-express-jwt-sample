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
module.exports.waitInit = function (done) {
    setTimeout(function(){done(); }, 1000);
};
module.exports.app = app;
module.exports.createOAuthToken = function (id, email) {
    return 'Bearer ' + jwt.encode({_id: id, email: email}, config.tokenSecret);
};

