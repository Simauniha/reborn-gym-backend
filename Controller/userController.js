const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userTable } = require('../Model/table');

const userRegisterController = async (req, res) => {
    try {
        let { user_name, user_email, user_password, user_phone, user_age, user_height, user_weight } = req.body;
        const user_profileImage = req.file;

        const isFound = await userTable.findOne({ user_email });

        if (isFound) {
            return res.status(400).send({
                success: false,
                code: 400,
                error: true,
                message: "User already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);

        const data = new userTable({
            user_name,
            user_email,
            user_phone,
            user_age,
            user_height,
            user_weight,
            user_password: hashedPassword,
            user_profileImage: user_profileImage ? user_profileImage.filename : null
        });

        const result = await data.save();

        res.status(201).send({
            success: true,
            code: 201,
            data: result,
            error: false,
            message: "User registered successfully",
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            code: 500,
            error: true,
            message: "Error in Register API",
            details: err.message
        });
    }
};

const userLoginController = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;

        if (!user_email || !user_password) {
            return res.status(400).send({
                success: false,
                code: 400,
                error: true,
                message: "Email and password are required"
            });
        }

        // ✅ Check if admin login
        if (
            user_email === process.env.ADMIN_EMAIL &&
            user_password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                { userType: "admin", email: user_email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.status(200).send({
                success: true,
                code: 200,
                message: "Admin login successful",
                userType: "admin",
                token,
                redirectTo: "/adminDashboard" // frontend can use this to redirect
            });
        }

        // ✅ Else normal user login
        const user = await userTable.findOne({ user_email }).lean();
        if (!user) {
            return res.status(404).send({
                success: false,
                code: 404,
                error: true,
                message: "User not found, please register"
            });
        }

        const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                code: 401,
                error: true,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, userType: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const safeUser = { ...user };
        delete safeUser.user_password;

        return res.status(200).send({
            success: true,
            code: 200,
            message: "User login successful",
            userType: "user",
            user: safeUser,
            token,
            redirectTo: "/userDashboard"
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send({
            success: false,
            code: 500,
            error: true,
            message: "Error in Login",
            details: err.message
        });
    }
};

const getAllUsersController = async (req, res) => {
  try {
    // Fetch selected user fields only
    const users = await userTable.find(
      {},
      "user_name user_email user_phone user_age user_height user_weight "
    );

    res.status(200).send({
      success: true,
      code: 200,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({
      success: false,
      code: 500,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Extracted from token

    const user = await userTable.findById(userId).select(
      "user_name user_email user_phone user_age user_height user_weight"
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};


module.exports = {
    userRegisterController,
    userLoginController,
    getAllUsersController,
    getUserProfileController
};
