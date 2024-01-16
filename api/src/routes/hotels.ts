import express, { Response, Request } from 'express';
import Hotel from '../models/hotel';
import { HotelSearchResponse } from '../shared/types';


const searchRouter = express.Router();

// /api/hotels/search?
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
        res.status(500).json({ error: "Something went wrong" });
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