import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check } from "express-validator";
import { validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const userRouter = express.Router();

userRouter.get("/me",verifyToken, async (req: Request, res: Response) => {  
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password"); 
    if (!user) {
      return res.status(404).send({ message: "User not found(users.ts GET/me)" });
    }
    res.json(user);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error fetching user(users.ts Get/me)" });
  }
});

userRouter.post("/register",[
    check("email","Email is required").isEmail(),                  
    check("password","Password is required atleast 6 characters").isLength({min:6}),
    check("firstName","First Name is required").isString(),
    check("lastName","Last Name is required").isString(),

], async (req: Request, res: Response) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){      
        return res.status(400).json({message:errors.array()});  
    }
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.status(400).send({
        message: "Email already exists",
      });
    }

    user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        maxAge: 86400000,  
    });
    res.status(201).json({ message: "User registered successfully", token }); 

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error registering user(users.ts POST/register)" });
  }
});

export default userRouter;