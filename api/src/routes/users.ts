import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check } from "express-validator";
import { validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const userRouter = express.Router();

userRouter.get("/me",verifyToken, async (req: Request, res: Response) => {    //this is the endpoint of current log in user
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");   //here we are selecting all the fields except the password might be a security issue when passing to frontend
    if (!user) {
      return res.status(404).send({ message: "User not found(users.ts GET/me)" });
    }
    res.json(user);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error fetching user(users.ts Get/me)" });
  }
});

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
        maxAge: 86400000,  //expiresIn: "1d" in milliseconds
    });
    res.status(201).json({ message: "User registered successfully", token });  //todo: remove token from response by consideration

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error registering user(users.ts POST/register)" });
  }
});

export default userRouter;