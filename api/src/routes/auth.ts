import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/user";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const authRouter = express.Router();

authRouter.post("/login",[
    check("email", "Email is required").isEmail(),
    check("password", "Password is required atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Invalid Credentials" });
      }

      const token = jwt.sign(   //creating an access token  If the passwords match, it generates a JSON Web Token (JWT) using jwt.sign containing the userId from the found user. This token is signed with a secret key 
        {
          userId: user.id,
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
         res.cookie("auth_token", token, {      //The generated token is then set in a cookie named "auth_token" with options for HTTP-only access, secure transmission in production, and an expiration time of 24 hours 
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });

        res.status(200).json({ message: "Logged in successfully", userId: user.id});
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error logging in" });
    }
  }
);

authRouter.get("/validate-token",verifyToken,(req:Request,res:Response) => {    //this route is used to validate the token
    res.status(200).json({message:"Token is valid",userId:req.userId});    //here we are sending the userId to the client
});   

export default authRouter;
