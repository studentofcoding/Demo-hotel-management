import { Link } from "react-router-dom";
import { HotelType } from "../../../api/src/shared/types";
import { AiFillStar } from "react-icons/ai";

type props = {
    hotel: HotelType;
};

const SearchResultCard = ({hotel}: props) => {
    return(
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
            <div className="w-full h-[300px]">   {/*here we are setting image size to be same all the images */}
                <img src={hotel.imageUrls[0]} className="w-full h-full object-cover object-center" alt="hotel" />
            </div>
            <div className="grid grid-rows-[1fr_2fr_1fr]">
                <div className="flex items-center">
                    <span className="flex">
                        {Array.from({ length: hotel.starRating }).map(() => (
                            <AiFillStar className="text-amber-500" />
                        ))}  
                    </span>
                    <span className="ml-1 text-sm">
                        {hotel.type}
                    </span>
                </div>
                <Link to={`/details/${hotel._id}`} className="text-2xl font-bold cursor-pointer">
                    {hotel.name}
                </Link>
            </div>
            <div className="line-clamp-4">{hotel.description}</div>

            <div className="grid grid-cols-2 items-end whitespace-nowrap">
                <div className="flex gap-1 items-center">
                    {hotel.facilities.slice(0, 3).map((facility) => (     //here we are slicing the facilities to show only 3
                        <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs">
                            {facility}
                        </span>
                    ))}
                    <span className="text-sm">
                        {hotel.facilities.length > 3 && `+${hotel.facilities.length - 3} more`}
                    </span>                      
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="font-bold">
                    £{hotel.pricePerNight} per night
                    </span>
                    <Link to={`/details/${hotel._id}`} className="bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-900">
                        View More
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SearchResultCard;