import express, { Response, Request } from 'express';
import Hotel from '../models/hotel';
import { BookingType, HotelSearchResponse } from '../shared/types';
import { param, validationResult } from 'express-validator';
import Stripe from 'stripe';
import verifyToken from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const searchRouter = express.Router();

// /api/hotels/search?       //order matters for 1.searchRouter.get("/search"   then   2.searchRouter.get("/:id"   then   3.constructSearchQuery  
searchRouter.get("/search", async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);   //This line calls the constructSearchQuery function and passes the query parameters to it. The function returns a MongoDB query object that we can use to search for hotels.
        
        //***2.the query passed from constructSearchQuery is passed to below function to sort */
        let sortOption = {};    //This initializes an empty object that will be used to build the MongoDB sort query.
        switch(req.query.sortOption){    
            case "starRating":
                sortOption = { starRating: -1 };   //This line sets the sortOptions object to sort by starRating in descending order.
                break;
            case "pricePerNightAsc":      //pricePerNight is passed from model hotel.ts
                sortOption = { pricePerNight: 1 };   //This line sets the sortOptions object to sort by pricePerNight in ascending order.
                break;
            case "pricePerNightDesc":
                sortOption = { pricePerNight: -1 };   //This line sets the sortOptions object to sort by pricePerNight in descending order.
                break;
        }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");    //this is a ternary operator that checks if the "page" query parameter exists. If it does, it converts it to a string using toString(). If it doesn't exist, it defaults to the string "1". Then, we convert the string to a number using parseInt().

        const skip = (pageNumber - 1) * pageSize;   //This calculates the number of items to skip in a paginated query based on the page number and page size. For example, if the page number is 2 and the page size is 5, we need to skip the first 5 items (page 1) and get the next 5 items (page 2).

        //*****3.find the passed queries    */
        const hotels = await Hotel.find(query)
        .sort(sortOption)     //the order is important   //this sort option is in link with Search.tsx "<select value={sortOption} onChange={(event) => setSortOption(event.target.value)} className="p-2 border rounded-md">"
        .skip(skip)
        .limit(pageSize);   //This line executes a MongoDB query to retrieve hotels from a collection..skip(skip): This part of the query tells MongoDB to skip the first skip number of documents.This part of the query limits the number of documents returned to the specified pageSize, ensuring that only a certain number of items are returned per page.

        const total = await Hotel.countDocuments();   //This line executes a MongoDB query to count the total number of documents in a collection.

        const response: HotelSearchResponse = {     //This object contains the hotels and pagination information that we will send back to the client.
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        }
        res.json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong(hotel.ts GET/search)" });
    }
});

searchRouter.get("/", async (req: Request, res: Response) => {     //serving homepage
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

searchRouter.get("/:id",[param("id").notEmpty().withMessage("Hotel Id is required")], async (req: Request, res: Response) => {
  const errors = validationResult(req);   //This line checks if there are any validation errors in the request. If there are, it returns a 400 response with the errors.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id.toString();   //This line extracts the id parameter from the request.
  try {
    const hotel = await Hotel.findById(id);   //This line executes a MongoDB query to retrieve a hotel by id.
    res.json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching hotel(hotel.ts GET/:id)" });
  }
});

searchRouter.post("/:hotelId/booking/payment-intent",verifyToken, async (req: Request, res: Response) => {      //This line creates a new payment intent for a booking. It uses the verifyToken middleware to ensure that the user is authenticated before creating the payment intent.
  //1. total cost
  //2. hotel id
  //3. user id     the parameters we need to pass 
  const { numberOfNights } = req.body;     //This implies that the client sending a request to this endpoint should include a numberOfNights field in the body of the request.when a client makes a POST request to this endpoint and includes a JSON   //This line extracts the numberOfNights from the request body  //req.body values are passed from req: Request  //the user is already in the bookings page so we can extract the number of nights from the request body.
  const hotelId = req.params.hotelId;   //This line extracts the hotelId from the request parameters.
  
  const hotel = await Hotel.findById(hotelId);   //This line executes a MongoDB query to retrieve a hotel by id.
  if (!hotel) {
    return res.status(404).json({ error: "Hotel not found(hotel.ts Post/:hotelId/bookings/payment-intent)" });
  }

  const totalCost = hotel.pricePerNight * numberOfNights;   //This line calculates the total cost of the booking by multiplying the pricePerNight by the numberOfNights.

  const paymentIntent = await stripe.paymentIntents.create({      //This line creates a new payment intent using the Stripe API.
    amount: totalCost * 100,   //This line converts the total cost to cents because Stripe expects the amount to be in cents
    currency: "lkr",     //TODO: change to required currency
    metadata: {        //This line helps to find oug whether the booking has been paid or not before save it  to the database
      hotelId,
      userId: req.userId,   
    },
  });

  if(!paymentIntent.client_secret){      //client_secret this is generated by stripe
    return res.status(500).json({ error: "Error creating payment intent(hotel.ts Post/:hotelId/bookings/payment-intent)" });   //this error is thrown if there is any error with stripe
  }

  const response = {   
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost,
  }

  res.json(response);   //This line sends the payment intent id and client secret back to the client.

});

searchRouter.post("/:hotelId/booking",verifyToken, async (req: Request, res: Response) => {     //This line creates a new booking for a hotel. It uses the verifyToken middleware to ensure that the user is authenticated before creating the booking.
  try {
    const paymentIntentId = req.body.paymentIntentId;   //This line extracts the paymentIntentId from the request body.

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);   //This line retrieves the payment intent from the Stripe API using the paymentIntentId.

    if(!paymentIntent){    //This means if the frontend sends a payment intent that doesn't exists.
      return res.status(404).json({ message: "Payment intent not found(hotel.ts Post/:hotelId/bookings)" });
    }

    if(paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.params.userId){    //This line checks if the hotelId in the payment intent metadata matches the hotelId in the request parameters.
      return res.status(400).json({ message: "payment intent mismatch" });
    }

    if(paymentIntent.status !== "succeeded"){    //This line checks if the payment intent status is succeeded because we don't need to complete the booking if the payment has not been made.
      return res.status(400).json({ message: "payment intent not succeeded" });
    }

    const newBooking: BookingType = {
      ...req.body,
      userId: req.userId,   
    }

    const hotel = await Hotel.findOneAndUpdate(
      {_id: req.params.hotelId},   //this going to find the hotel based on the hotel id that passed from here/this line
      {$push: {bookings: newBooking}}   //This line executes a MongoDB query to update the hotel by id and push the new booking to the bookings array.
    )

    if(!hotel){
      return res.status(404).json({ message: "Hotel not found(hotel.ts Post/:hotelId/bookings)" });
    }

    await hotel.save();   //This line saves the hotel to the database.
    res.status(200).send();   //This line sends a 200 response to the client.
    //for further understanding of the data flow of this function https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=17&t=18000s at 13.32.58
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating booking(hotel.ts Post/:hotelId/bookings)" });
  }
});

//********1.from here the query is taken and passed to sorting options above */
const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};    //This initializes an empty object (constructedQuery) that will be used to build the MongoDB query.
  
    if (queryParams.destination) {      //constructs a MongoDB $or query. This checks if either the city or country field matches the provided destination using a case-insensitive regular expression.
      constructedQuery.$or = [
        { city: new RegExp(queryParams.destination, "i") },
        { country: new RegExp(queryParams.destination, "i") },
      ];
    }
  
    if (queryParams.adultCount) {    //constructs a query to filter results where the adultCount is greater than or equal to the provided value.
      constructedQuery.adultCount = {
        $gte: parseInt(queryParams.adultCount),
      };
    }
  
    if (queryParams.childCount) {      //constructs a query to filter results where the childCount is greater than or equal to the provided value.
      constructedQuery.childCount = {
        $gte: parseInt(queryParams.childCount),
      };
    }
  
    if (queryParams.facilities) {     //constructs a query to filter results where all specified facilities are present in the facilities array.
      constructedQuery.facilities = {
        $all: Array.isArray(queryParams.facilities)    //Array.isArray(queryParams.facilities) ? queryParams.facilities : [queryParams.facilities]: This ternary operator ensures that facilities is an array. If it's already an array, it remains unchanged. If it's not an array, it is wrapped in an array.
          ? queryParams.facilities
          : [queryParams.facilities],   
      };
    }
  
    if (queryParams.types) {    //constructs a query to filter results where the type field matches any of the specified types.
      constructedQuery.type = {
        $in: Array.isArray(queryParams.types)
          ? queryParams.types
          : [queryParams.types],
      };
    }
  
    if (queryParams.stars) {      // constructs a query to filter results where the starRating field matches any of the specified star ratings.
      const starRatings = Array.isArray(queryParams.stars)
        ? queryParams.stars.map((star: string) => parseInt(star))
        : parseInt(queryParams.stars);
  
      constructedQuery.starRating = { $in: starRatings };
    }
  
    if (queryParams.maxPrice) {     //constructs a query to filter results where the pricePerNight is less than or equal to the provided value.
      constructedQuery.pricePerNight = {
        $lte: parseInt(queryParams.maxPrice).toString(),
      };
    }
  
    return constructedQuery;
  };

export default searchRouter;