var fs = require('fs');
var join = require('path').join;
var mongodb = require('mongodb');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/config');
var urljoin = require('url-join');
var path = require('path');
var errors = require( './components/errors');

var app = express();
var port = process.env.PORT || 3000;

var connect = function () {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    mongoose.connect(config.db, options);
};

var prepareDb = function () {

    var populate = function () {
        fs.readdirSync(join(__dirname, './feed')).forEach(function (file) {
            if (~file.indexOf('.js')) require(join(__dirname, './feed', file));
        });
    };

    if (process.env.NODE_ENV == 'test') {
        mongoose.connection.db.dropDatabase(function () {
            populate();
        });
    } else {
        populate();
    }
};

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
mongoose.connection.on('open', prepareDb);
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
connect();

fs.readdirSync(join(__dirname, './models')).forEach(function (file) {
    if (~file.indexOf('.js')) {
        require(join(__dirname, './models', file));
    }
});

require('./config/passport')(passport);
require('./config/express')(app, passport);

fs.readdirSync(join(__dirname, './routes')).forEach(function (file) {
    if (~file.indexOf('.js')) {
        app.use(urljoin('/api/', file.replace(/\.[^/.]+$/, "")), require(join(__dirname, './routes', file)));
    }
});

app.route('/:url(api|bower_components)/*')
    .get(errors[404]);





app.listen(port);

module.exports = app;