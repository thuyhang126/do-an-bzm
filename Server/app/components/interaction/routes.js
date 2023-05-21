const express = require('express');
const router = express.Router();

const InteractionController = require('./controllers/InteractionController');
const CoreMiddleware = require('@core/middlewares/CoreMiddleware');

router.post('/create', CoreMiddleware.authenticated, (req, res, next) => InteractionController.createInteraction(req, res));

module.exports = router;
