const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userTable } = require('../Model/table');
const userRegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //   new userTableSchema({name,email,password})
        const isFound = await userTable.findOne({ email });
        if (isFound) {
            return res.status(400).send({
                success: true,
                code: 400,
                error: false,
                message: "User already registered"
            })
        } else {
            // password encryption
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = new userTable({ name, email, password: hashedPassword });
            const result = await data.save();
            res.status(201).send({
                success: true,
                code: 201,
                data: result,
                error: false,
                message: "User registered successfully",
            })
        }

    } catch (err) {
        res.status(500).send({
            success: false,
            code: 500,
            error: true,
            message: "Error in Register api",
            err
        })
    }
}

const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userTable.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const toekn = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                res.status(200).send({
                    success: true,
                    code: 200,
                    message: "Login successful",
                    data: user,
                    toekn
                })
            } else {
                return res.status(401).send({
                    success: false,
                    code: 401,
                    error: true,
                    message: "Invalid email or password"
                })
            }
        } else {
            return res.status(404).send({
                success: false,
                code: 404,
                error: true,
                message: "User not found, please register"
            })
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            code: 500,
            error: true,
            message: "Error in Login ",
            err
        })
    }
}
module.exports = {
    userRegisterController,
    userLoginController
};