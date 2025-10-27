import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { supabase } from "../db/supabase";
import jwt from "jsonwebtoken";
import { check } from "express-validator";
import { validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const userRouter = express.Router();

userRouter.get("/me",verifyToken, async (req: Request, res: Response) => {  
  const userId = req.userId;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('id', userId)
      .limit(1);
    if (error) {
      console.log(error);
      return res.status(500).send({ message: "Error fetching user(users.ts Get/me)" });
    }
    const user = data && data[0];
    if (!user) {
      return res.status(404).send({ message: "User not found(users.ts GET/me)" });
    }
    res.json({ _id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name });

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
    const { email, password, firstName, lastName } = req.body;

    const { data: existing, error: existError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);
    if (existError) {
      console.log(existError);
      return res.status(500).send({ message: "Error registering user(users.ts POST/register)" });
    }
    if (existing && existing.length > 0) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 8);
    const { data: created, error: createError } = await supabase
      .from('users')
      .insert([{ email, password: hashed, first_name: firstName, last_name: lastName }])
      .select('id')
      .limit(1);
    if (createError) {
      console.log(createError);
      return res.status(500).send({ message: "Error registering user(users.ts POST/register)" });
    }

    const newUser = created && created[0];
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
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