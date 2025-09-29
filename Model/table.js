const mongoose = require('mongoose');
const userTableSchema = new mongoose.Schema({
    user_name: { type: String, required: true },
    user_email: { type: String, required: true, unique: true },
    user_password: { type: String, required: true },
    user_phone: { type: String },
    user_age: { type: Number },
    user_height: { type: Number },
    user_weight: { type: Number },
    user_profileImage: { type: String }
}, { timestamps: true });
const userTable=mongoose.model('users',userTableSchema); 
module.exports={
    userTable
};