import express from 'express';
import {Signin, signup} from '../controllers/auth.controller.js';

const authRouter=express.Router();

authRouter.post("/sign-up",signup);
authRouter.post("/sign-in",Signin);

export default authRouter;
//because we are using export default the name when importing to the index.js file can be anything