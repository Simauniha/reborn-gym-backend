
const { check} = require("express-validator")

const ValidationRules = [
    check("user_name")
        .isEmpty()
        .withMessage("Student Name is Required")
        .matches(/^[a-zA-Z ]{15,30}$/)
        .withMessage("Enter the valid name")
        .trim(),

    check("user_email")
        .isEmpty()
        .withMessage("Student email is Required")
        .isEmail()
        .withMessage("Student email is Required"),

    check("user_password")
        .isEmpty()
        .withMessage("Password is Required")
        .trim(),

    check("user_phone")
        .isEmpty()
        .withMessage("Student class is Required")
        .trim(),

    check("user_age")
        .isEmpty()
        .withMessage("Student marks is Required")
        .trim(),

    check("user_height")
        .isEmpty()
        .withMessage("Student marks is Required")
        .trim(),

    check("user_weight")
        .isEmpty()
        .withMessage("Student marks is Required")
        .trim(),
]

module.exports=ValidationRules