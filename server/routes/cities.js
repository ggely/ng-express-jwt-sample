var express = require('express');
var passport = require('passport');
var controller = require('../controllers/cities');
var auth = require('../auth/auth.service');
var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.searchByName);

module.exports = router;
