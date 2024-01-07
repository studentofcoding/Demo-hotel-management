import express,{ Request,Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Hotel, { HotelType } from '../models/hotel';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';

const hotelRouter = express.Router();

const storage = multer.memoryStorage();    //store all the files pushed, to the cloudinary //handle the image files
const upload = multer({
    storage,
    limits:{
        fileSize:1024*1024*5  //5MB
    }
});

//api/my-hotels
hotelRouter.post("/",verifyToken,[
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
],upload.array("imageFiles",6),async(req:Request,res:Response) => {    //this will pass a imageFiles array with 6 images with the other details of the form in frontend
    try {
        const imageFiles = req.files as Express.Multer.File[];   //here we are taking the imageFiles from the req.files
        const newHotel: HotelType = req.body; //"HotelType" is from the hotel model      //here we are taking the other details of the form from the req.body


        //uploading the images to cloudinary
        const uploadPromises = imageFiles.map(async(image)=>{     //the "imageFiles" here is the const in try block
            const b64 = Buffer.from(image.buffer).toString("base64");   //here we are converting the image to base64 string so that we can send it to the cloudinary
            const dataURI = "data:" + image.mimetype + ";base64," + b64;    //here this string describes the image  //"mimetype" is the type of the image jpg/png
            const res = await cloudinary.v2.uploader.upload(dataURI);   //here we are uploading the image to cloudinary

            return res.url;  //here we are returning the url of the image
            //because this function is async the images will upload to the cloudinary simultaneously
        });

        //if the upload is successful,add the urls  to the new hotel
        const imageUrls = await Promise.all(uploadPromises);   //here we are waiting for all the images to upload to the cloudinary before continuing the execution of the code
        newHotel.imageUrls = imageUrls;   //here we are adding the imageUrls from the cloudinary to the new hotel
        newHotel.lastUpdated = new Date();   //here we are adding the lastUpdated date to the new hotel
        newHotel.userId = req.userId;   //here we are adding the userId to the new hotel,this is taken from the auth_token

        //save the new hotel to the database
        const hotel = new Hotel(newHotel);  //here we are creating a new hotel
        await hotel.save();   //here we are saving the new hotel to the database

        //return a 201 response
        res.status(201).send(hotel);   //here we are sending the new hotel details to the frontend
        //for further understanding refer the tutorial https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=7&t=18000s at 5:15:00
        

    } catch (error) {
        console.log("Error creating a new hotel",error);
        res.status(500).send("Something went wrong");   //in the tutorial res.status(500).json({message:"Something went wrong"}) is used
    }
});

export default hotelRouter;