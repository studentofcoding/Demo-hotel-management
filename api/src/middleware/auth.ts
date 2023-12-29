import { NextFunction,Request,Response } from "express";   //NextFunction is used to call the next middleware
import jwt from "jsonwebtoken";

declare global {      //creates a custom type for the request object
    namespace Express {
      interface Request {
        userId: string;
      }
    }
  }

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token= req.cookies[ "auth_token" ];   //here we are taking the token from the cookie
    if(!token){
        return res.status(401).json({message:"unauthorized"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY as string);  //here we are verifying the token
        req.userId = (decoded as {userId:string}).userId;
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({message:"unauthorized"});
    }
};

export default verifyToken;