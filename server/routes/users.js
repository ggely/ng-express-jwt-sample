var express = require('express');
var passport = require('passport');

var router = express.Router();

router.post('/login',
    passport.authenticate('local'),
    function (req, res) {
        res.send();
    });

module.exports = router;