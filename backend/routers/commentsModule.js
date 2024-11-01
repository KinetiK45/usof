const Router = require('express');
const router = new Router();
const comments = require('../controllers/сommentsController');
const token_controller = require('../controllers/ApiTokenController');

router.get('/:comment_id', comments.get_comment_by_id);
router.get('/:comment_id/like', comments.get_comment_likes_by_id);
router.post('/:comment_id/like', token_controller.verifyToken, comments.comment_like);
router.patch('/:comment_id', token_controller.verifyToken, comments.edit_comment);
router.delete('/:comment_id', token_controller.verifyToken, comments.delete_comment);
router.delete('/:comment_id/like', token_controller.verifyToken, comments.delete_comment_like);

module.exports = router