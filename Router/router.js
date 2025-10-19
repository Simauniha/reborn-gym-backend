const express = require('express');

const router = express.Router();
const { userRegisterController,userLoginController,getAllUsersController,getUserProfileController } = require('../Controller/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('../middleware/multer');

router.post('/register', multer.single("user_profileImage"),userRegisterController);
router.post('/login',userLoginController);
router.get("/users", getAllUsersController);
router.get("/profile", authMiddleware, getUserProfileController);

module.exports = router;