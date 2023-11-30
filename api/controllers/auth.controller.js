import User from '../models/user.models.js';
import bcrypt from 'bcrypt';

const signup = async(req,res)=>{
    const {username,email,password}=req.body;
    const hashedPassword=bcrypt.hashSync(password,10);

    const newUser=new User({
        username,
        email,
        password:hashedPassword});

    try{
        await newUser.save();  //when we use await the codde is going to wait until this code is executed
        res.status(201).json("User created successfully");
    } catch(err) {
        res.status(500).json(err.message);
    }


};      

export default signup;