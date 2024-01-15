import express, { Response, Request } from 'express';
import Hotel from '../models/hotel';
import { HotelSearchResponse } from '../shared/types';

const searchRouter = express.Router();

// /api/hotels/search?
searchRouter.get("/search", async (req: Request, res: Response) => {
    try {
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");    //this is a ternary operator that checks if the "page" query parameter exists. If it does, it converts it to a string using toString(). If it doesn't exist, it defaults to the string "1". Then, we convert the string to a number using parseInt().
 
        const skip = (pageNumber - 1) * pageSize;   //This calculates the number of items to skip in a paginated query based on the page number and page size. For example, if the page number is 2 and the page size is 5, we need to skip the first 5 items (page 1) and get the next 5 items (page 2).

        const hotels = await Hotel.find().skip(skip).limit(pageSize);   //This line executes a MongoDB query to retrieve hotels from a collection..skip(skip): This part of the query tells MongoDB to skip the first skip number of documents.This part of the query limits the number of documents returned to the specified pageSize, ensuring that only a certain number of items are returned per page.

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
        // res.status(500).json({ error: "Something went wrong" });
    }
});


export default searchRouter;