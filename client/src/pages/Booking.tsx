import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../Context/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../Context/AppContext";


const Booking = () => {
    const { stripePromise } = useAppContext();
    const search = useSearchContext();
    const { hotelId } = useParams();    //hotelId is the endpoint which extracted from the link    //this will extract the hotelId from the url  //the hotelId is extracted from the link made from "<Route path="/hotel/:hotelId/booking" element={<Layout><Booking /></Layout>} />" in App.tsx  

    const [numberOfNights, setNumberOfNights] = useState<number>(0);   //this will set the number of nights to 0

    useEffect(() => {   
        if(search.checkIn && search.checkOut){
            const nights = Math.floor(Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24) + 1);   //this will calculate the number of nights   //abs means absolute value

            setNumberOfNights(nights);   //this will set the number of nights
        }
    }, [search.checkIn, search.checkOut])

    const { data:paymentIntentData } = useQuery("createPaymentIntent", () => apiClient.createPaymentIntent(hotelId as string,numberOfNights.toString()),{
        enabled: !!hotelId && numberOfNights > 0,   //this will only run if there is a hotelId and numberOfNights is greater than 0
    })

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

            {currentUser && paymentIntentData && 
            <Elements stripe={stripePromise} options={{clientSecret: paymentIntentData.clientSecret}}>    {/* this will pass the stripePromise and the clientSecret to the stripe for better understanding https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=17&t=18000s at 13.45.09 */}
                <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
            </Elements>}     
        </div>
    )
};
    

export default Booking;