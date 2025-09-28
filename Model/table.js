const mongoose = require('mongoose');
 
const userTableSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,default:"Test@12345"},
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()}
});
const userTable=mongoose.model('users',userTableSchema); 
module.exports={
    userTable
};