import { useQuery } from "react-query";
import { useSearchContext } from "../Context/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";

const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);   //here we are setting the page number to 1

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
    }

    const { data: hotelData } = useQuery(["searchHotels",searchParams],()=>apiClient.searchHotels(searchParams));           //here we use react query to call our search end point

    return (
        <div>
            <p>Search Page</p>
        </div>
    );
};

export default Search;