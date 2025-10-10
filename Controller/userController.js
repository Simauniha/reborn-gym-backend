const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userTable } = require('../Model/table');
const userRegisterController = async (req, res) => {
    try {
        let { user_name, user_email, user_password, user_phone, user_age, user_height, user_weight } = req.body;
        const user_profileImage = req.file;

        // console.log(user_name, user_email, user_password, user_phone, user_age, user_height, user_weight, user_profileImage);

        // Check if user already exists
        const isFound = await userTable.findOne({ user_email });

        if (isFound) {
            return res.status(400).send({
                success: false,
                code: 400,
                error: true,
                message: "User already registered"
            });
        }

        // Password encryption
        const hashedPassword = await bcrypt.hash(user_password, 10);

        // Create new user
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
        // console.log(user_email, user_password);
        

        const user = await userTable.findOne({ user_email });
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

        const token =await jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        ); 
    
      return  res.status(200).send({
            success: true,
            code: 200,
            message: "Login successful",
            data: user,
            token
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


module.exports = {
    userRegisterController,
    userLoginController
};