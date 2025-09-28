const express=require('express');

const app=express();

const DbConnect=require('./Config/dbConfig');

const router=require('./Router/router');

require('dotenv').config();

const PORT=process.env.PORT || 8000;


app.use(express.json());
DbConnect();

app.use('/api',router)

app.listen(PORT,()=>{
    console.log("server is running on port 8000");
})