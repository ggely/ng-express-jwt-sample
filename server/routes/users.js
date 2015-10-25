var express = require('express');
var passport = require('passport');
var controller = require('../controllers/users');
var auth = require('../auth/auth.service');
var router = express.Router();

router.post('/login', passport.authenticate('local'), controller.getToken);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/', auth.isAdmin(), controller.getAllNonAdminUsers);
router.post('/', auth.isAdmin(), controller.createUser);
router.get('/:id', auth.isAdmin(), controller.getUser);
router.post('/:id', auth.isAdmin(), controller.modifyUser);

module.exports = router;
