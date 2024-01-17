import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRouter from './routes/users';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import hotelRouter from './routes/my-hotels';
import searchRouter from './routes/hotels';
import bookingRouter from './routes/my-bookings';

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET 
// });

try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('Connected to Cloudinary successfully');
} catch (error) {
    console.log(error);
};

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

app.use(express.static(path.join(__dirname, "../../client/dist")));   //for deployment  //make the connection to the frontend to run in the same localhost or the same server simultaneously

app.use("/api/users",userRouter);  //this route is used to register the user
app.use("/api/auth",authRouter);  //this route is used to login the user
app.use("/api/my-hotels",hotelRouter);  //this route is used to add a new hotel
app.use("/api/hotels",searchRouter);  //this route is used to get all the hotels
app.use("/api/my-bookings",bookingRouter);  //this route is used to get all the bookings of the user

app.get("*",(req:Request,res:Response) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));  //for deployment //pass on any request url that are not api endpoints the reason we are doing this is because of some our routes are behind conditional logic and wont be a part of the static files that are done above 
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});