/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var jwt = require('jwt-simple');
var config = require('./config');

var local = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: true
    },
    function (email, password, done) {

        var options = {
            criteria: {email: email},
            select: 'email hashed_password salt'
        };
        User.load(options, function (err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, {message: 'Unknown user'});
            }
            if (!user.authenticate(password)) {
                return done(null, false, {message: 'Invalid password'});
            }
            var token = jwt.encode({_id: user._id, email: user.email}, config.tokenSecret);
            user.authToken = token;
            user.save(function (err) {
                if (err)return done(err);
                done(null, user);
            });
        });
    }
);

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.load({criteria: {_id: id}}, function (err, user) {
            done(err, user);
        });
    });

    passport.use(local);
};