/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('static-favicon');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var config = require('./config');

module.exports = function (app, passport) {

    app.use(express.static('dist/public'));

    app.use(favicon());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());

    app.use(passport.initialize());
    app.use(passport.session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        cookie: {secure: false},
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));

};