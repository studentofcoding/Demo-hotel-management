import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check } from "express-validator";
import { validationResult } from "express-validator";

const userRouter = express.Router();

// /api/users/register
userRouter.post("/register",[
    check("email","Email is required").isEmail(),                  //here we are using the express-validator to check if the email is valid or not
    check("password","Password is required atleast 6 characters").isLength({min:6}),
    check("firstName","First Name is required").isString(),
    check("lastName","Last Name is required").isString(),

], async (req: Request, res: Response) => {
    const errors=validationResult(req);  //here we are using the validationResult function to check if there is any error in the request
    if(!errors.isEmpty()){      //if errors is not empty then we are sending the errors in the form of array
        return res.status(400).json({message:errors.array()});  //here we are sending the errors in the form of array
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
        secure: process.env.NODE_ENV === "production",  //this is used to check if the environment is production or not 
        maxAge: 86400000,  //expiresIn: "1d", in milliseconds
    });
    res.status(201).json({ message: "User registered successfully", token });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error registering user" });
  }
});

export default userRouter;