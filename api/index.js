import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router.js";

dotenv.config();
const app=express();
app.use(express.json()); //allow json inputs to the server

mongoose.connect(process.env.MONGO)
.then(()=>console.log('DataBase is Connected successfully'))
.catch(err=>console.log(err));

app.use("/api/auth",authRouter);







app.listen(3000,()=>{
    console.log("server is running on port 3000")
});