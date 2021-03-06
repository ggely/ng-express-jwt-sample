var mongoose = require('mongoose');
var User = mongoose.model('User');
var City = mongoose.model('City');
var FollowedCities = mongoose.model('FollowedCities');

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
exports.deleteUser = function (req, res) {
    var userId = req.params.id;
    var _deleteUser = function () {
        User.findOne({
            _id: userId
        }).remove(function () {
            return res.status(200).send();
        });
    };

    User.findOne({
        _id: userId
    }, 'email isAdmin followedCities', function (err, user) {
        if (err || !user) return res.status(500).send({error: 'Enable to find user'});
        FollowedCities.findOrCreateByUser(user, function (err, followedCities) {
                if (err) return res.status(500).send({error: 'Enable to find user'});
                if (!followedCities) {
                    _deleteUser(user);
                } else {
                    followedCities.remove(_deleteUser(user));
                }
            }
        );
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

exports.addCity = function (req, res) {
    if (!req.body.ref) return res.status(400).send({error: "No city given"});
    User.findOne({
        _id: req.user._id
    }, 'followedCities', function (err, user) {
        if (err) return res.status(500).send({error: 'Enable to find users'});

        City.findOne({ref: req.body.ref}, function (err, city) {
            if (err) return res.status(500).send({error: "Unable to save city"});

            var _getOrCreateFollowedCities = function (city) {

                FollowedCities.findOrCreateByUser(user, function (err, followedCities) {

                    if (err) return res.status(500).send({error: "Unable to save city"});

                    if (followedCities.cities.indexOf(city._id) === -1) {
                        followedCities.cities.push(city._id);

                        followedCities.save(function (err) {
                            if (err) return res.status(500).send({error: "Unable to add city"});
                            return res.json(city);
                        });
                    } else {
                        return res.json(city);
                    }
                });
            };

            if (!city) {
                city = new City(req.body);
                city.save(function (err, city) {
                    if (err) return res.status(500).send({error: "Unable to save city"});
                    _getOrCreateFollowedCities(city);
                });
            } else {
                _getOrCreateFollowedCities(city);
            }
        });
    });
};

exports.removeCity = function (req, res) {
    if (!req.params.cityId) return res.status(400).send({error: "No city given"});
    User.findOne({
        _id: req.user._id
    }, 'followedCities', function (err, user) {
        if (err || !user) return res.status(500).send({error: 'Enable to find users'});
        FollowedCities.findOrCreateByUser(user, function (err, followedCities) {
            if (err || !followedCities) return res.status(500).send({error: "Unable to delete city"});
            var index = followedCities.cities.indexOf(req.params.cityId);
            if (index !==-1) {
                followedCities.cities.splice(index, 1);

                followedCities.save(function (err) {
                    if (err) return res.status(500).send({error: "Unable to delete city"});
                    return res.status(200).send();
                });
            } else {
                return res.status(500).send({error: "City not followed"});
            }
        });

    });
};

exports.getCities = function (req, res) {
    User.findOne({
        _id: req.user._id
    }, function (err, user) {
        if (err) res.status(500).send({error: 'Enable to find user'});

        FollowedCities.load({
            user: user._id
        }, function (err, followedCities) {
            if (err) res.status(500).send({error: 'Enable to find cities'});
            if (!followedCities || !followedCities.cities) return res.status(200).send([]);
            res.json(followedCities.cities);
        });
    });
};

exports.getToken = getToken;