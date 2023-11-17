const Router = require('express');
const router = new Router();
const post = require('../controllers/postController');
const token_controller = require('../controllers/ApiTokenController');

router.get('/', post.posts);
router.get('/:post_id', post.posts_post_id);
router.get('/:post_id/comments', post.post_comments_all);
router.post('/:post_id/comments', token_controller.verifyToken, post.create_post_comment);
router.get('/:post_id/categories', post.get_categories);
router.get('/:post_id/like', post.get_post_likes);
router.post('/', token_controller.verifyToken, post.create_post);
router.post('/:post_id/like', token_controller.verifyToken, post.like_post);
router.patch('/:post_id', token_controller.verifyToken, post.edit_post);
router.delete('/:post_id', token_controller.verifyToken, post.delete_post);
router.delete('/:post_id/like', token_controller.verifyToken, post.delete_post_like);

module.exports = router