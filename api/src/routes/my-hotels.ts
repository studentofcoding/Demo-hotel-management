import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { supabase } from '../db/supabase';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';
import { HotelType } from '../shared/types';

const hotelRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

hotelRouter.post("/", verifyToken, [
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
], upload.array("imageFiles", 6), async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;


    const imageUrls = await uploadImages(imageFiles);

    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;

    const { data, error } = await supabase
      .from('hotels')
      .insert([{ 
        user_id: newHotel.userId,
        name: newHotel.name,
        city: newHotel.city,
        country: newHotel.country,
        description: newHotel.description,
        type: newHotel.type,
        adult_count: newHotel.adultCount,
        child_count: newHotel.childCount,
        facilities: newHotel.facilities,
        price_per_night: newHotel.pricePerNight,
        star_rating: newHotel.starRating,
        image_urls: newHotel.imageUrls,
        last_updated: newHotel.lastUpdated,
      }])
      .select('*')
      .limit(1);

    if (error) {
      console.log("Error creating a new hotel", error);
      return res.status(500).send("Something went wrong(my-hotels.ts POST/)");
    }

    const hotel = data && data[0];
    res.status(201).send({
      _id: hotel.id,
      userId: hotel.user_id,
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      description: hotel.description,
      type: hotel.type,
      adultCount: hotel.adult_count,
      childCount: hotel.child_count,
      facilities: hotel.facilities,
      pricePerNight: hotel.price_per_night,
      starRating: hotel.star_rating,
      imageUrls: hotel.image_urls,
      lastUpdated: hotel.last_updated,
      bookings: [],
    });


  } catch (error) {
    console.log("Error creating a new hotel", error);
    res.status(500).send("Something went wrong(my-hotels.ts POST/)");
  }
});

hotelRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('user_id', req.userId)
      .order('last_updated', { ascending: false });
    if (error) {
      console.log(error);
      return res.status(500).send("Something went wrong(hotels.ts GET/)");
    }
    const hotels = (data || []).map((h: any) => ({
      _id: h.id,
      userId: h.user_id,
      name: h.name,
      city: h.city,
      country: h.country,
      description: h.description,
      type: h.type,
      adultCount: h.adult_count,
      childCount: h.child_count,
      facilities: h.facilities,
      pricePerNight: h.price_per_night,
      starRating: h.star_rating,
      imageUrls: h.image_urls,
      lastUpdated: h.last_updated,
      bookings: [],
    }));
    res.json(hotels)
  } catch (error) {
    res.status(500).send("Something went wrong(hotels.ts GET/)");
  }
})

hotelRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId)
      .limit(1);
    if (error) {
      console.log(error);
      return res.status(500).send("Error fetching hotel(hotels.ts GET/:id)");
    }
    const hotel = data && data[0];
    if (!hotel) return res.status(404).send("Hotel not found");
    res.json({
      _id: hotel.id,
      userId: hotel.user_id,
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      description: hotel.description,
      type: hotel.type,
      adultCount: hotel.adult_count,
      childCount: hotel.child_count,
      facilities: hotel.facilities,
      pricePerNight: hotel.price_per_night,
      starRating: hotel.star_rating,
      imageUrls: hotel.image_urls,
      lastUpdated: hotel.last_updated,
      bookings: [],
    });
  } catch (error) {
    res.status(500).send("Error fetching hotel(hotels.ts GET/:id)");
  }
});

hotelRouter.put("/:hotelId", verifyToken, upload.array("imageFiles"), async (req: Request, res: Response) => {
  try {
    const updatedHotel: HotelType = req.body;
    const files = req.files as Express.Multer.File[];
    const uploadedImageUrls = await uploadImages(files);
    const finalImageUrls = [...uploadedImageUrls, ...(updatedHotel.imageUrls || [])];

    const { data, error } = await supabase
      .from('hotels')
      .update({
        name: updatedHotel.name,
        city: updatedHotel.city,
        country: updatedHotel.country,
        description: updatedHotel.description,
        type: updatedHotel.type,
        adult_count: updatedHotel.adultCount,
        child_count: updatedHotel.childCount,
        facilities: updatedHotel.facilities,
        price_per_night: updatedHotel.pricePerNight,
        star_rating: updatedHotel.starRating,
        image_urls: finalImageUrls,
        last_updated: new Date(),
      })
      .eq('id', req.params.hotelId)
      .eq('user_id', req.userId)
      .select('*')
      .limit(1);

    if (error) {
      console.log(error);
      return res.status(500).send("Something went wrong(hotels.ts PUT/:hotelId)");
    }
    const hotel = data && data[0];
    if (!hotel) return res.status(404).send("Hotel not found");
    res.status(200).send({
      _id: hotel.id,
      userId: hotel.user_id,
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      description: hotel.description,
      type: hotel.type,
      adultCount: hotel.adult_count,
      childCount: hotel.child_count,
      facilities: hotel.facilities,
      pricePerNight: hotel.price_per_night,
      starRating: hotel.star_rating,
      imageUrls: hotel.image_urls,
      lastUpdated: hotel.last_updated,
      bookings: [],
    });

  } catch (error) {
    res.status(500).send("Something went wrong(hotels.ts PUT/:hotelId)");
  }
});




async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = (image.buffer as Buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${b64}`;
    const res = await cloudinary.uploader.upload(dataURI);

    return res.secure_url || res.url;

  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}


export default hotelRouter;
