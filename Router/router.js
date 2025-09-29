const express = require('express');

const router = express.Router();
const { userRegisterController,userLoginController } = require('../Controller/userController');

const ValidationRules=require("../Validation/ValidaitonRules");

const multer = require('../middleware/multer');

router.post('/register', multer.single("user_profileImage"),userRegisterController);
router.post('/login',ValidationRules,userLoginController);

module.exports = router;