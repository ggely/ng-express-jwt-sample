
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

var local = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        var options = {
            criteria: { email: email },
            select: 'name username email hashed_password salt'
        };
        User.load(options, function (err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }
            if (!user.authenticate(password)) {
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        });
    }
);

module.exports = function (passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.load({ criteria: { _id: id } }, function (err, user) {
            done(err, user);
        });
    });

    passport.use(local);
};