import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { supabase } from "../db/supabase";
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
      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .limit(1);

      if (fetchError) {
        console.log(fetchError);
        return res.status(500).send({ message: "Error logging in" });
      }

      const user = users && users[0];
      if (!user) {
        return res.status(400).send({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Invalid Credentials" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res.status(200).json({ message: "Logged in successfully", userId: user.id });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error logging in" });
    }
  }
);

authRouter.get("/validate-token",verifyToken,(req:Request,res:Response) => {    
    res.status(200).json({message:"Token is valid",userId:req.userId});    
});

authRouter.post("/logout", (req: Request, res: Response) => {
    res.cookie("auth_token","",{    
      expires: new Date(0),
    });
    res.send(); 
  });

export default authRouter;





