var mongoose = require('mongoose');
var should = require('should');
process.env.NODE_ENV = 'test';
var app = require('../../server/server');
var User = mongoose.model('User');

module.exports = {
    clearUser: function (done) {
        mongoose.model('User').find({'isAdmin': false}).remove(done);
    },
    app: app
};
