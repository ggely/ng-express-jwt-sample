var mongoose = require('mongoose');
var User = mongoose.model('User');

getToken = function (req, res) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, 'email authToken', function (err, user) {
        if (err) return res.status(500).send({error: 'Enable to get token'});
        if (!user) return res.status(401).send('Unauthorized');
        res.json({auth_token: user.authToken});
    });
};

exports.me = function (req, res) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, 'email isAdmin', function (err, user) {
        if (err) res.status(500).send({error: 'Enable to find your user'});
        res.json(user);
    });
};
exports.getUser = function (req, res) {
    var userId = req.params.id;
    User.findOne({
        _id: userId
    }, 'email isAdmin', function (err, user) {
        if (err) return res.status(500).send({error: 'Enable to find user'});
        res.json(user);
    });
};
exports.createUser = function (req, res) {
    var newUser = new User({
        email: req.body.email,
        password: req.body.password
    });
    newUser.save(function (err, user) {
        if (err) return res.status(500).send({error: err.message});
        User.findOne({
            _id: user._id
        }, 'email isAdmin', function (err, user) {
            if (err) return res.status(500).send({error: err.message});
            res.json(user);
        });
    });
};
exports.validateEmail = function (req, res) {
    User.findOne({
        email: req.query.email
    }, 'email isAdmin', function (err, user) {
        if (err) return res.status(500).send({error: err.message});
        if (!user) return res.status(200).send();
        if (req.query._id == user._id) {
            return res.status(200).send();
        } else {
            res.status(403).send();
        }
    });
};
exports.modifyUser = function (req, res) {
    User.findOne({
        _id: req.params.id
    }, 'email isAdmin', function (err, user) {
        if (err) res.status(500).send({error: 'Enable to find user'});
        user.email = req.body.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.isAdmin = user.isAdmin || false;
        user.save(function (err, user) {
            if (err) return res.status(500).send({error: err.message});
            User.findOne({
                _id: user._id
            }, 'email isAdmin', function (err, user) {
                res.json(user);
            });
        });
    });
};
exports.getAllNonAdminUsers = function (req, res) {
    User.find({'isAdmin': false}, 'email isAdmin', function (err, users) {
        if (err) return res.status(500).send({error: 'Enable to find users'});
        res.json(users);
    });
};
exports.getToken = getToken;