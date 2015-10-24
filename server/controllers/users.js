var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.me = function (req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, 'email isAdmin', function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
};
exports.getUser = function (req, res, next) {
    var userId = req.params.id;
    User.findOne({
        _id: userId
    }, 'email isAdmin', function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
};
exports.createUser = function (req, res, next) {
    var newUser = new User({
        email: req.body.email,
        password: req.body.password
    });
    newUser.save( function (err, user) {
        if (err) return next(err);
        User.findOne({
            _id: user._id
        }, 'email isAdmin', function (err, user) {
            if (err) return next(err);
            res.json(user);
        });
    });
};
exports.getAllNonAdminUsers = function (req, res, next) {
    User.find({'isAdmin': false},'email isAdmin', function (err, users) {
        if (err) return next(err);
        res.json(users);
    });
};
exports.getToken = function (req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, 'email authToken', function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');
        res.json({auth_token: user.authToken});
    });
};