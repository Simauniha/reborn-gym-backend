const express=require('express');

const app=express();
require('dotenv').config();
const DbConnect=require('./Config/dbConfig');

const router=require('./Router/router');
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

DbConnect();


const PORT=process.env.PORT || 8000;




app.use('/api',router)

app.listen(PORT,()=>{
    console.log("server is running on port 8000");
})