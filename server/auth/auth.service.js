var passport = require('passport');
var config = require('../config/config');
var compose = require('composable-middleware');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function isAuthenticated() {
    return function (req, res, next) {

        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorized');
        }
        var token = req.headers.authorization.replace('Bearer ', '');
        var decoded;
        try {
            decoded = jwt.decode(token, config.tokenSecret);
        }
        catch (err) {
            return res.status(401).send('Unauthorized');
        }

        if (!decoded || !decoded._id) {
            res.status(401).send('Unauthorized');
        }
        var options = {
            criteria: {_id: decoded._id},
            select: 'email isAdmin'
        };
        User.load(options, function (err, user) {
            if (err) return res.status(401).send('Unauthorized');
            if (!user) {
               return res.status(401).send('Unauthorized');
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
function isLoggedUser() {
    return compose()
        .use(isAuthenticated())
        .use(function validate(req, res, next) {
            if (req.query._id && req.query._id === req.user._id) return next();
            if (req.params.id && req.params.id === req.user.id) return next();
            res.status(403).send('Forbidden');
        });
}
function isAdminOrIdem() {
    return compose()
        .use(isAuthenticated())
        .use(function validate(req, res, next) {
            if (req.user.isAdmin) return next();
            if (req.query._id && req.query._id === req.user._id) return next();
            if (req.params.id && req.params.id === req.user._id) return next();
            res.status(403).send('Forbidden');
        });
}

exports.isAdmin = isAdmin;
exports.isAdminOrIdem = isAdminOrIdem;
exports.isAuthenticated = isAuthenticated;
exports.isLoggedUser = isLoggedUser;