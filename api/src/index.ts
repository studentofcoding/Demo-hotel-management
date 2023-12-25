import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO as string)
.then(() => console.log('Connected to Database successfully'))
.catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/test', async(req:Request, res:Response) => {
  res.json({message:'Hello World from express!'});
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});