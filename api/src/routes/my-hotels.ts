import express,{ Request,Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Hotel from '../models/hotel';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';
import { HotelType } from '../shared/types';

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
        const imageUrls = await uploadImages(imageFiles);   //here we are waiting for all the images to upload to the cloudinary before continuing the execution of the code
        //**** here the below function is refactored so we can  use this function more than once easily

        //**************** 
        //uploading the images to cloudinary
        //  const uploadPromises = imageFiles.map(async(image)=>{     //the "imageFiles" here is the const in try block
        //     const b64 = Buffer.from(image.buffer).toString("base64");   //here we are converting the image to base64 string so that we can send it to the cloudinary
        //     const dataURI = "data:" + image.mimetype + ";base64," + b64;    //here this string describes the image  //"mimetype" is the type of the image jpg/png
        //     const res = await cloudinary.v2.uploader.upload(dataURI);   //here we are uploading the image to cloudinary

        //     return res.url;  //here we are returning the url of the image
        //     //because this function is async the images will upload to the cloudinary simultaneously
        // });

        // //if the upload is successful,add the urls  to the new hotel
        // const imageUrls = await Promise.all(uploadPromises);   //here we are waiting for all the images to upload to the cloudinary before continuing the execution of the code

        //****************

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
        res.status(500).send("Something went wrong(my-hotels.ts POST/)");   //in the tutorial res.status(500).json({message:"Something went wrong"}) is used
    }
});

hotelRouter.get("/",verifyToken, async(req:Request,res:Response) => {
    try {
        const hotels = await Hotel.find({userId:req.userId});   //here we are finding the hotels with the userId
        res.json(hotels)
    } catch (error) {
        res.status(500).send("Something went wrong(hotels.ts GET/)");
    }
})

hotelRouter.get("/:id",verifyToken,async(req:Request,res:Response) => {
    const id = req.params.id.toString(); //here we are taking the id of the hotel
    try {
        const hotel = await Hotel.findOne({
            _id:id,
            userId:req.userId,     //here we are finding the hotel with the id and the userId
        });   
        res.json(hotel);
    } catch (error) {
        res.status(500).send("Error fetching hotel(hotels.ts GET/:id)");
    }
});  

hotelRouter.put("/:hotelId",verifyToken,upload.array("imageFiles"), async(req:Request,res:Response) => {     //here we are passing the hotelId from the EditHotel.tsx the useParams
    try {
        const updatedHotel:HotelType = req.body;   //here we are taking the updated hotel details from the req.body
        updatedHotel.lastUpdated = new Date();   //here we are adding the lastUpdated date to the updated hotel

        const hotel = await Hotel.findOneAndUpdate({
            _id:req.params.hotelId,   //here we are finding the hotel with the hotelId
            userId:req.userId,   //here we are finding the hotel with the userId
        },updatedHotel,{new:true});    //here we are updating the hotel with the updated hotel details

        if(!hotel){
            return res.status(404).send("Hotel not found");
        }

        const files = req.files as Express.Multer.File[];   //here we are taking the any new files if the user decides to add new images

        const updatedImageUrls = await uploadImages(files); 

        hotel.imageUrls = [...updatedImageUrls,...updatedHotel.imageUrls || []];   //here we are adding the updated imageUrls to the hotel
        
        //  //uploading the images to cloudinary
        // const uploadPromises = files.map(async(image)=>{     //the "imageFiles" here is the const in try block
        //     const b64 = Buffer.from(image.buffer).toString("base64");   //here we are converting the image to base64 string so that we can send it to the cloudinary
        //     const dataURI = "data:" + image.mimetype + ";base64," + b64;    //here this string describes the image  //"mimetype" is the type of the image jpg/png
        //     const res = await cloudinary.v2.uploader.upload(dataURI);   //here we are uploading the image to cloudinary

        //     return res.url;  //here we are returning the url of the image
        //     //because this function is async the images will upload to the cloudinary simultaneously
        // });

        // //if the upload is successful,add the urls  to the new hotel
        // const imageUrls = await Promise.all(uploadPromises);   //here we are waiting for all the images to upload to the cloudinary before continuing the execution of the code

        await hotel.save();   //here we are saving the updated hotel to the database
        res.status(200).send(hotel);   //here we are sending the updated hotel details to the frontend

    } catch (error) {
        res.status(500).send("Something went wrong(hotels.ts PUT/:hotelId)");
    }
});




async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64"); //here we are converting the image to base64 string so that we can send it to the cloudinary
        const dataURI = "data:" + image.mimetype + ";base64," + b64; //here this string describes the image  //"mimetype" is the type of the image jpg/png
        const res = await cloudinary.v2.uploader.upload(dataURI); //here we are uploading the image to cloudinary

        return res.url; //here we are returning the url of the image

        //because this function is async the images will upload to the cloudinary simultaneously
    });

    //if the upload is successful,add the urls  to the new hotel
    const imageUrls = await Promise.all(uploadPromises); //here we are waiting for all the images to upload to the cloudinary before continuing the execution of the code
    return imageUrls;
}


export default hotelRouter;
