const express = require('express');
const router = express.Router();
const LoginRequest = require('@auth/request/LoginRequest');
const CoreMiddleware = require('@core/middlewares/CoreMiddleware');
const LoginController = require('@auth/controllers/LoginController');


router.post('/register', (req, res, next) => LoginController.register(req, res));

router.post('/login', LoginRequest.rules, (req, res, next) => LoginController.login(req, res));

router.post('/refresh', (req, res) => LoginController.resetToken(req, res));

router.post('/logout', CoreMiddleware.authenticated, (req, res) => LoginController.logout(req, res));

router.get('/getUsersDestroy', (req, res) => LoginController.getUsersDestroy(req, res));

module.exports = router;
