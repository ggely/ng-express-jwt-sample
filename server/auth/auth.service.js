var passport = require('passport');
var config = require('../config/config');
var compose = require('composable-middleware');
var jwt = require('jwt-simple');

function isAuthenticated() {
    return function (req, res, next) {
        var decoded = jwt.decode(req.headers.token, config.tokenSecret);

        var options = {
            criteria: { authToken: req.headers.token },
            select: 'email isAdmin'
        };
        User.load(options, function (err, user) {
            if (err) return res.status(401).send('Unauthorized');
            if (!user) {
                res.status(401).send('Unauthorized');
            }
            req.user=user;
            next();
        });
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