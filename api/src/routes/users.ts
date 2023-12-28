import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

// /api/users/register
userRouter.post("/register", async (req: Request, res: Response) => {
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