var passport = require('passport');
var config = require('../config/config');
var compose = require('composable-middleware');

function isAuthenticated() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.status(401).send('Unauthorized');
        }
    };
}

function isAdmin() {
    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (req.user.isAdmin) {
                next();
            }
            else {
                res.status(403).send('Forbidden');
            }
        });
}

exports.isAdmin = isAdmin;
exports.isAuthenticated = isAuthenticated;