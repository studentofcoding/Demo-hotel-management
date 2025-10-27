import express, { Response, Request } from 'express';
import { supabase } from '../db/supabase';
import { BookingType, HotelSearchResponse } from '../shared/types';
import { param, validationResult } from 'express-validator';
import Stripe from 'stripe';
import verifyToken from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const searchRouter = express.Router();

searchRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const destination = (req.query.destination || "") as string;
    const adultCount = req.query.adultCount ? parseInt(req.query.adultCount as string) : undefined;
    const childCount = req.query.childCount ? parseInt(req.query.childCount as string) : undefined;
    const facilitiesParam = req.query.facilities;
    const typesParam = req.query.types;
    const starsParam = req.query.stars;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
    const sortOption = (req.query.sortOption || "") as string;

    const pageSize = 5;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('hotels').select('*', { count: 'exact' });

    if (destination) {
      query = query.or(`city.ilike.%${destination}%,country.ilike.%${destination}%`);
    }
    if (adultCount !== undefined) {
      query = query.gte('adult_count', adultCount);
    }
    if (childCount !== undefined) {
      query = query.gte('child_count', childCount);
    }
    if (facilitiesParam) {
      const facilities = Array.isArray(facilitiesParam) ? facilitiesParam : [facilitiesParam as string];
      query = query.contains('facilities', facilities);
    }
    if (typesParam) {
      const types = Array.isArray(typesParam) ? typesParam : [typesParam as string];
      query = query.in('type', types);
    }
    if (starsParam) {
      const stars = Array.isArray(starsParam)
        ? (starsParam as string[]).map((s) => parseInt(s))
        : [parseInt(starsParam as string)];
      query = query.in('star_rating', stars);
    }
    if (maxPrice !== undefined) {
      query = query.lte('price_per_night', maxPrice);
    }

    if (sortOption === 'starRating') {
      query = query.order('star_rating', { ascending: false });
    } else if (sortOption === 'pricePerNightAsc') {
      query = query.order('price_per_night', { ascending: true });
    } else if (sortOption === 'pricePerNightDesc') {
      query = query.order('price_per_night', { ascending: false });
    } else {
      query = query.order('last_updated', { ascending: false });
    }

    const { data, count, error } = await query.range(from, to);
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong(hotel.ts GET/search)' });
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
    const total = count || 0;
    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong(hotel.ts GET/search)' });
  }
});

searchRouter.get("/", async (req: Request, res: Response) => {    
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('last_updated', { ascending: false });
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching hotels' });
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
    res.json(hotels);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Error fetching hotels' });
  }
});

searchRouter.get("/:id",[param("id").notEmpty().withMessage("Hotel Id is required")], async (req: Request, res: Response) => {
  const errors = validationResult(req);  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id.toString(); 
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', id)
      .limit(1);
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error fetching hotel(hotel.ts GET/:id)' });
    }
    const hotel = data && data[0];
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
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
    console.log(error);
    res.status(500).json({ error: 'Error fetching hotel(hotel.ts GET/:id)' });
  }
});

searchRouter.post("/:hotelId/booking/payment-intent",verifyToken, async (req: Request, res: Response) => {      
  const { numberOfNights } = req.body;  
  const hotelId = req.params.hotelId;  
  
  const { data, error } = await supabase
    .from('hotels')
    .select('price_per_night')
    .eq('id', hotelId)
    .limit(1);
  const hotel = data && data[0];
  if (!hotel) {
    return res.status(404).json({ error: "Hotel not found(hotel.ts Post/:hotelId/bookings/payment-intent)" });
  }

  const totalCost = hotel.price_per_night * numberOfNights;  

  const paymentIntent = await stripe.paymentIntents.create({   
    amount: totalCost * 100,   
    currency: "lkr",     
    metadata: {       
      hotelId,
      userId: req.userId,   
    },
  });

  if(!paymentIntent.client_secret){     
    return res.status(500).json({ error: "Error creating payment intent(hotel.ts Post/:hotelId/bookings/payment-intent)" });   
  }

  const response = {   
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost,
  }

  res.json(response);   

});

searchRouter.post("/:hotelId/booking",verifyToken, async (req: Request, res: Response) => {    
  try {
    const paymentIntentId = req.body.paymentIntentId;  

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId); 

    if(!paymentIntent){   
      return res.status(404).json({ message: "Payment intent not found(hotel.ts Post/:hotelId/bookings)" });
    }

    if(paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.userId){    
      return res.status(400).json({ message: "payment intent mismatch" });
    }

    if(paymentIntent.status !== "succeeded"){    
      return res.status(400).json({ message: "payment intent not succeeded" });
    }

    const newBooking: BookingType = {
      ...req.body,
      userId: req.userId,
    };

    const { error: insertError } = await supabase
      .from('bookings')
      .insert([{ 
        hotel_id: req.params.hotelId,
        user_id: req.userId,
        first_name: newBooking.firstName,
        last_name: newBooking.lastName,
        email: newBooking.email,
        adult_count: newBooking.adultCount,
        child_count: newBooking.childCount,
        check_in: new Date(newBooking.checkIn),
        check_out: new Date(newBooking.checkOut),
        total_cost: newBooking.totalCost,
      }]);
    if (insertError) {
      console.log(insertError);
      return res.status(500).json({ message: 'Error creating booking(hotel.ts Post/:hotelId/bookings)' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating booking(hotel.ts Post/:hotelId/bookings)" });
  }
});

// Mongo-style constructSearchQuery removed; Supabase filters applied directly above

export default searchRouter;