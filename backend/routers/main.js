const Router = require('express');

const authenticationRoutes = require('./authenticationModule');
const userRoutes = require('./userModule');
const postRoutes = require('./postModule');
const categoryRoutes = require('./categoriesModule');
const commentsRoutes = require('./commentsModule')

const router = new Router();

router.use('/api/auth', authenticationRoutes);
router.use('/api/users', userRoutes);
router.use('/api/posts', postRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/comments', commentsRoutes);

module.exports = router;