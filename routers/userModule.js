const Router = require('express');
const router = new Router();
const user = require('../controllers/userController');
const upload = require('./multer');
const token_controller = require('../controllers/ApiTokenController');

router.get('/', user.users);
router.get('/:user_id', user.users_user_id);
router.post('/', user.users_creation);
router.patch('/avatar', token_controller.verifyToken, upload.single('photo'), user.avatar_upload);
router.get('/:user_id/avatar', user.user_avatar);
router.patch('/:user_id', token_controller.verifyToken, user.user_edit);
router.delete('/:user_id', user.user_delete);

module.exports = router