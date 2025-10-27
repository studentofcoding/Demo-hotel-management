import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import { supabase } from "../db/supabase";
import { HotelType, BookingType } from "../shared/types";

const bookingRouter = express.Router();

bookingRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { data: bookingRows, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', req.userId);
    if (bookingError) {
      console.log(bookingError);
      return res.status(500).json({ message: "Unable to fetch bookings" });
    }

    const hotelIds = Array.from(new Set((bookingRows || []).map((b: any) => b.hotel_id)));
    if (hotelIds.length === 0) {
      return res.status(200).send([]);
    }

    const { data: hotelsData, error: hotelsError } = await supabase
      .from('hotels')
      .select('*')
      .in('id', hotelIds);
    if (hotelsError) {
      console.log(hotelsError);
      return res.status(500).json({ message: "Unable to fetch bookings" });
    }

    const hotelsById = new Map((hotelsData || []).map((h: any) => [h.id, h]));
    const results: HotelType[] = (hotelsData || []).map((hotel: any) => {
      const userBookings: BookingType[] = (bookingRows || [])
        .filter((b: any) => b.hotel_id === hotel.id)
        .map((b: any) => ({
          _id: b.id,
          userId: b.user_id,
          firstName: b.first_name,
          lastName: b.last_name,
          email: b.email,
          adultCount: b.adult_count,
          childCount: b.child_count,
          checkIn: b.check_in,
          checkOut: b.check_out,
          totalCost: b.total_cost,
        }));
      const hotelWithUserBookings: HotelType = {
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
        bookings: userBookings,
      };
      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

export default bookingRouter;