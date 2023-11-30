import express from 'express';
import signup from '../controllers/auth.controller.js';

const router=express.Router();

router.post("/sign-up",signup);

export default router;
//because we are using export default the name when importing to the index.js file can be anything