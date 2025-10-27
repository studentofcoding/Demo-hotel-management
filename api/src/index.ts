import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
// MongoDB removed for Supabase migration
import userRouter from './routes/users';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import hotelRouter from './routes/my-hotels';
import searchRouter from './routes/hotels';
import bookingRouter from './routes/my-bookings';

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

// Supabase is initialized via src/db/supabase.ts; no direct connect required

const app = express();
// Enable CORS for dev and production
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../../client/dist")));   

app.use("/api/users",userRouter);  
app.use("/api/auth",authRouter);  
app.use("/api/my-hotels",hotelRouter);  
app.use("/api/hotels",searchRouter); 
app.use("/api/my-bookings",bookingRouter);  

app.get("*",(req:Request,res:Response) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));  
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});