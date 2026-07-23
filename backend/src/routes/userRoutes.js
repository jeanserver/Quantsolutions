const express = require('express');
const { getMe, updateMe, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { changePasswordValidator } = require('../validators/authValidator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/me/password', changePasswordValidator, validateRequest, changePassword);

module.exports = router;
