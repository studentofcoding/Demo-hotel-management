import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoute from './routes/users';

mongoose.connect(process.env.MONGO as string)
.then(() => console.log('Connected to Database successfully'))
.catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users",userRoute);  //this route is used to register the user

app.listen(3000, () => {
    console.log('Server running on port 3000');
});