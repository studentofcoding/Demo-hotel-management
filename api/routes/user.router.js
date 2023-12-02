import express from 'express';
import  {updateUser,deleteUser}  from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const userRouter=express.Router();

userRouter.post("/update/:id",verifyToken,updateUser); //user.id that get from params  //here the functionality of verifyToken is to get the user id from the token and then we are passing the id to the updateUser function
userRouter.delete("/delete/:id",verifyToken,deleteUser);
export default userRouter;