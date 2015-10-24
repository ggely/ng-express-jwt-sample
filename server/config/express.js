
/**
 * Module dependencies.
 */

var express = require('express');

var bodyParser = require('body-parser');



var env = process.env.NODE_ENV || 'development';
module.exports = function (app, passport) {

    app.use(express.static('/public'));


    // bodyParser should be above methodOverride
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

};