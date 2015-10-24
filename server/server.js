var fs = require('fs');
var join = require('path').join;
var mongodb = require('mongodb');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/config');

var app = express();
var port = process.env.PORT || 3000;

var connect = function () {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    mongoose.connect(config.db, options);
};

var isFeed = false;
var dropAndFeed = function () {

    var feed = function () {
        fs.readdirSync(join(__dirname, './feed')).forEach(function (file) {
            if (~file.indexOf('.js')) require(join(__dirname, './feed', file));
        });
        isFeed = !isFeed;
    };

    if (!isFeed) {
        if (process.env.NODE_ENV == 'test') {
            mongoose.connection.db.dropDatabase(function () {
                feed();
            });
        } else {
            feed();
        }
    }
};

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
mongoose.connection.on('connected', dropAndFeed);
connect();

fs.readdirSync(join(__dirname, './models')).forEach(function (file) {
    if (~file.indexOf('.js')) require(join(__dirname, './models', file));
});

require('./config/express')(app, passport);

fs.readdirSync(join(__dirname, './routes')).forEach(function (file) {
    if (~file.indexOf('.js')) require(join(__dirname, './routes', file))(app, passport);
});

app.listen(port);

module.exports = app;