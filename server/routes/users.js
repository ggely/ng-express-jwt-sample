var express = require('express');
var passport = require('passport');
var controller = require('../controllers/users');
var auth = require('../auth/auth.service');
var router = express.Router();

router.post('/login', passport.authenticate('local'), controller.me);
router.get('/me', auth.isAuthenticated(), controller.me);

module.exports = router;
