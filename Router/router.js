const express = require('express');

const router = express.Router();
const { userRegisterController,userLoginController } = require('../Controller/userController');
router.get('/register',userRegisterController);
router.get('/login',userLoginController);
module.exports = router;