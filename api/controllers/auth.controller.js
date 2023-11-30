import User from '../models/user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorHandler from '../utils/error.js';

const signup= async(req,res,next)=>{
    const {username,email,password}=req.body;
    const hashedPassword=bcrypt.hashSync(password,10);
    const newUser=new User({
        username,
        email,
        password:hashedPassword});
    try{
        await newUser.save();  //when we use await the code is going to wait until this code is executed
        res.status(201).json("User created successfully");
    } catch(err) {
        next(err);
    }
};      

const Signin=async(req,res,next)=>{
    const {email,password}=req.body;
    try {
        const validUser=await User.findOne({email});
        if(!validUser){
            return next(errorHandler(401,"User not found"));
        }
        const validPassword=bcrypt.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(401,"Invalid Credentials"));
        }
        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=validUser._doc;   //basically here destructed   //here "rest" is the user without the password,sending the details from the database except the password
        res
            .cookie("token",token,{httpOnly:true})
            .status(200)
            .json(rest);

    } catch (error) {
        next(error);
    }
}
     

export {signup,Signin};