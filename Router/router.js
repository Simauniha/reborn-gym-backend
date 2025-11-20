const express = require('express');

const router = express.Router();

const {
  userRegisterController,
  userLoginController,
  getAllUsersController,
  getUserProfileController,
  updateProfileController,
  updatePasswordController
} = require('../Controller/userController');

const authMiddleware = require('../middleware/authMiddleware');
const multer = require('../middleware/multer');

router.post('/register', multer.single("user_profileImage"),userRegisterController);

router.post('/login',userLoginController);

router.get("/users", getAllUsersController);

router.get("/profile", authMiddleware, getUserProfileController);

router.put(
  "/user/update-profile",
  authMiddleware,
  multer.single("user_profileImage"),
  updateProfileController
);

router.put(
  "/user/update-password",
  authMiddleware,
  updatePasswordController
);

const {
  updateUserById,
  deleteUserById
} = require('../Controller/userController');

router.put("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);

module.exports = router;
