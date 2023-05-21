const express = require('express');
const router = express.Router();

const LikeController = require('./controllers/LikeController');
const CoreMiddleware = require('@core/middlewares/CoreMiddleware');

router.post('/', CoreMiddleware.authenticated, (req, res, next) => LikeController.createLike(req, res));
router.delete('/', CoreMiddleware.authenticated, (req, res, next) => LikeController.deleteLike(req, res));

module.exports = router;
