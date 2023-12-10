const Router = require('express');
const router = new Router();
const auth = require('../controllers/authController');
const token_controller = require('../controllers/ApiTokenController');


router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', token_controller.deactivateToken);
router.post('/password-reset', auth.password_reset);
router.post('/password-reset/:confirm_token', token_controller.verifLogin, auth.password_reset_confirmation);

module.exports = router