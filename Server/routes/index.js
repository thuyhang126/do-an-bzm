const express = require('express');
const router = express.Router();

const AuthRoutes = require('@auth/routes');
const InteractionRoutes = require('@interaction/routes');
const ProfileRoutes = require('@profile/routes');
const MatchRoutes = require('@match/routes');
const MessageRouter = require('@message/routes');
const PostRouter = require('@post/routes');
const LikeRouter = require('@like/routes');
const CommentRouter = require('@comment/routes');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Node Base JWT' });
});

router.get('/socket', function (req, res, next) {
  res.render('socket');
});

router.use('/api/auth', AuthRoutes);
router.use('/api/interaction', InteractionRoutes);
router.use('/api/profile', ProfileRoutes);
router.use('/api/match', MatchRoutes);
router.use('/api/message', MessageRouter);
router.use('/api/post', PostRouter);
router.use('/api/like', LikeRouter);
router.use('/api/comment', CommentRouter);

module.exports = router;
