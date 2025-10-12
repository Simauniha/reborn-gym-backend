const express = require('express');

const router = express.Router();
const { userRegisterController,userLoginController } = require('../Controller/userController');

const multer = require('../middleware/multer');

router.post('/register', multer.single("user_profileImage"),userRegisterController);
router.post('/login',userLoginController);

module.exports = router;