import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRouter from './routes/users';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';

mongoose.connect(process.env.MONGO as string)
.then(() => console.log('Connected to Database successfully'))
.catch((err) => console.log(err));

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL,  //the server will only accept the request from this particular url
    credentials: true,      //this is used to send the cookie to the server so that the server can identify the user where the security is increased
}));

app.use(express.static(path.join(__dirname, "../../client/dist")))

app.use("/api/users",userRouter);  //this route is used to register the user
app.use("/api/auth",authRouter);  //this route is used to login the user

app.listen(3000, () => {
    console.log('Server running on port 3000');
});