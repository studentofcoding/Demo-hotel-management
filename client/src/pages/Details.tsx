import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";


const Details = () => {
    const {hotelId} = useParams();   // get the hotelId from the URL

    const {data: hotel} = useQuery("getHotelById", ()=>apiClient.getHotelById(hotelId as string),{
        enabled: !!hotelId    // only fetch the hotel if the hotelId is available this becomes true else false
    });

    if(!hotel) return (<div>searching</div>); // if the hotel is not available, return null

    return(
        <div className="space-y-6">
            <div>
                <span className="flex">
                    {Array.from({length: hotel.starRating}).map(()=>(
                        <AiFillStar className="fill-yellow-400" />
                    ))}
                </span>
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:grid-cols-2">
                {hotel.imageUrls.map((image)=> (
                    <div className="h-[300px]">
                        <img src={image} alt={hotel.name} className="w-full h-full object-cover object-center rounded-md" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {hotel.facilities.map((facility)=> (
                    <div className="border border-slate-300 rounded-sm p-3">
                        {facility}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
                <div className="whitespace-pre-line">    {/* whitespace-pre-line is used to preserve the line breaks and avoid overflow */}
                    {hotel.description}
                </div>
                <div className="h-fit">    {/* h-fit is used to make the div fit the content */}
                    <GuestInfoForm pricePerNight={hotel.pricePerNight} hotelId={hotel._id} />
                </div>
            </div>
        </div>
    )
    
};

export default Details;
