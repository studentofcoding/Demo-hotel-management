import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../Context/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailsSummary";

const Booking = () => {
    const search = useSearchContext();
    const { hotelId } = useParams();    //hotelId is the endpoint which extracted from the link    //this will extract the hotelId from the url  //the hotelId is extracted from the link made from "<Route path="/hotel/:hotelId/booking" element={<Layout><Booking /></Layout>} />" in App.tsx  

    const [numberOfNights, setNumberOfNights] = useState<number>(0);   //this will set the number of nights to 0

    useEffect(() => {   
        if(search.checkIn && search.checkOut){
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24);   //this will calculate the number of nights   //abs means absolute value

            setNumberOfNights(nights);   //this will set the number of nights
        }
    }, [search.checkIn, search.checkOut])

    const { data:hotel } = useQuery("getHotelById",()=>apiClient.getHotelById(hotelId as string),{
        enabled: !!hotelId,     //this will only run if there is a hotelId
    });   //this will get the hotel by id

    const { data:currentUser } = useQuery("getCurrentUser", apiClient.getCurrentUser);

    if(!hotel) return null;   //this will return null if there is no hotel "Type 'HotelType | undefined' is not assignable to type 'HotelType'.
    
    return(
        <div className="grid md:grid-cols-[1fr_2fr]">
            <BookingDetailSummary 
                checkIn={search.checkIn} 
                checkOut={search.checkOut} 
                adultCount={search.adultCount}
                childCount={search.childCount}
                numberOfNights={numberOfNights}
                hotel={hotel} />   {/* hotel is passed to get the hotel location details */} 
            {currentUser && <BookingForm currentUser={currentUser} />}     {/* here the booking form will only display if there is a current user */}
        </div>
    )
};
    

export default Booking;