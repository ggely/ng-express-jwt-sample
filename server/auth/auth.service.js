var passport = require('passport');
var config = require('../config/config');
var compose = require('composable-middleware');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function isAuthenticated() {
    return function (req, res, next) {
        if (!req.headers.auth_token) {
            res.status(401).send('Unauthorized');
        }

        var decoded = jwt.decode(req.headers.auth_token, config.tokenSecret);

        if(!decoded || !decoded.email){res.status(401).send('Unauthorized');}
        var options = {
            criteria: {email: decoded.email},
            select: 'email isAdmin'
        };
        User.load(options, function (err, user) {
            if (err) return res.status(401).send('Unauthorized');
            if (!user) {
                res.status(401).send('Unauthorized');
            }
            req.user = user;
            next();
        });
    };
}

function isAdmin() {
    return compose()
        .use(isAuthenticated())
        .use(function validate(req, res, next) {
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