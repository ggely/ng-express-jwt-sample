/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {type: String, default: ''},
    provider: {type: String, default: ''},
    hashed_password: {type: String, default: ''},
    salt: {type: String, default: ''},
    authToken: {type: String, default: ''},
    isAdmin: {type: Boolean, default: false},
});

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.path('isAdmin').validate(function (isAdmin, next) {
    if (!isAdmin) {
        return next(true);
    }
    var User = mongoose.model('User');
    var user_id = this._id;
    User.findOne({'isAdmin': true}, function (err, admin) {
        if (admin && admin._id != user_id + '') {
            next(false);
        } else {
            next(true);
        }
    });
}, 'Only one admin should exist');

UserSchema.path('email').validate(function (email) {
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}, 'Email is invalid');

UserSchema.path('email').validate(function (email, fn) {
    var User = mongoose.model('User');

    if (this.isNew || this.isModified('email')) {
        User.find({email: email}).exec(function (err, users) {
            fn(!err && users.length === 0);
        });
    } else fn(true);
}, 'Email already exists');

UserSchema.path('hashed_password').validate(function (hashed_password) {
    var res = hashed_password && hashed_password.length && this._password && this._password.length;
    if (this._password) {
        res = res && this._password.length >= 4 && this._password.length <= 16;
    }
    return res;
}, 'Password should be between 4 and 16 characters');


/**
 * Methods
 */

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password || !this.salt) {
            return null;
        }

        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');

        return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
            .toString('base64');

    }
};

/**
 * Statics
 */

UserSchema.statics = {

    /**
     * Load
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function (options, cb) {
        options.select = options.select || 'name username';
        this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
    }
};

mongoose.model('User', UserSchema);