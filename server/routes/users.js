var express = require('express');
var passport = require('passport');
var controller = require('../controllers/users');
var auth = require('../auth/auth.service');
var router = express.Router();

router.post('/login', passport.authenticate('local'), controller.getToken);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/', auth.isAdmin(), controller.getAllNonAdminUsers);
router.post('/', auth.isAdmin(), controller.createUser);
router.get('/email', auth.isAdminOrIdem(), controller.validateEmail);
router.get('/:id', auth.isAdmin(), controller.getUser);
router.delete('/:id', auth.isAdmin(), controller.deleteUser);
router.post('/:id', auth.isAdmin(), controller.modifyUser);
router.post('/:id/cities', auth.isLoggedUser(), controller.addCity);
router.delete('/:id/cities/:cityId', auth.isLoggedUser(), controller.removeCity);
router.get('/:id/cities', auth.isLoggedUser(), controller.getCities);

module.exports = router;
