const Router = require('express');
const router = new Router();
const categories = require('../controllers/categoriesController');
const token_controller = require('../controllers/ApiTokenController');

router.get('/', categories.get_all);
router.get('/:category_id', categories.category_by_id);
router.get('/:category_id/posts', categories.posts_by_category);
router.post('/', token_controller.verifyToken, categories.create_category);
router.patch('/:category_id', token_controller.verifyToken, categories.edit_category);
router.delete('/:category_id', token_controller.verifyToken, categories.delete_category);

module.exports = router