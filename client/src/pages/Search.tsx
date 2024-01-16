import { useQuery } from "react-query";
import { useSearchContext } from "../Context/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);   //here we are setting the page number to 1 from here we are taking the current page number and then we are passing it to the pagination component    
    const [selectedStar, setSelectedStar] = useState<string[]>([]);   //here we are setting the selectedStar to an empty array and then we are passing it to the StarRatingFilter component
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);   //here we are setting the selectedHotelTypes to an empty array and then we are passing it to the HotelTypesFilter component
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);   //here we are setting the selectedFacilities to an empty array and then we are passing it to the FacilitiesFilter component
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();   //here we are setting the selectedPrice to an empty array and then we are passing it to the PriceFilter component
    const [sortOption, setSortOption] = useState<string>("");   //here we are setting the sortOption to an empty string and then we are passing it to the sortOption component

    const searchParams = {
        destination: search.destination,          //the properties of the searchParams(ex- destination: ) object should be same as the api-clint.tsx searchHotels "function queryParams.append("destination",searchParams.destination || "");" same as the word destination defined inside the bracket
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStar,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption,
    }

    const { data: hotelData } = useQuery(["searchHotels",searchParams],()=>apiClient.searchHotels(searchParams));           //here we use react query to call our search end point

    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {       //here we are defining the handleStarsChange function which will be passed to the StarRatingFilter component
        const starRating = event.target.value;      //this is the actual value the user selected, here we are getting the value of the checkbox which is clicked 

        setSelectedStar((prevStar)=>    //here we can check more than on checkbox
            event.target.checked     //here we are checking whether the checkbox is checked or not that we from the event
             ? [...prevStar, starRating]   //here we are adding the starRating to the selectedStar array
             : prevStar.filter((star) => star !== starRating));    //if the user unchecked  //here we are checking whether the checkbox is checked or not, if it is checked then we are adding the starRating to the selectedStar array and if it is not checked then we are removing the starRating from the selectedStar array
    }           //takes the current stars or the previous state of stars and the filter out the star which we selected,then its going to return a new array with all the stars except those stars and set everything to state

    const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {       //here we are defining the handleStarsChange function which will be passed to the StarRatingFilter component
        const hotelTypes = event.target.value;      //this is the actual value the user selected, here we are getting the value of the checkbox which is clicked 

        setSelectedHotelTypes((prevHotelTypes)=>    //here we can check more than on checkbox
            event.target.checked     //here we are checking whether the checkbox is checked or not that we from the event
             ? [...prevHotelTypes, hotelTypes]   //here we are adding the SelectedHotelTypes to the SelectedHotelTypes array
             : prevHotelTypes.filter((hotel) => hotel !== hotelTypes));    //if the user unchecked  //here we are checking whether the checkbox is checked or not, if it is checked then we are adding the hotelTypes to the selectedStar array and if it is not checked then we are removing the starRating from the selectedStar array
    }           //takes the current stars or the previous state of hotel and the filter out the hotel which we selected,then its going to return a new array with all the stars except those stars and set everything to state

    const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {       //here we are defining the handleStarsChange function which will be passed to the StarRatingFilter component
        const facilityType = event.target.value;      //this is the actual value the user selected, here we are getting the value of the checkbox which is clicked 

        setSelectedFacilities((prevFacilities)=>    //here we can check more than on checkbox
            event.target.checked     //here we are checking whether the checkbox is checked or not that we from the event
             ? [...prevFacilities, facilityType]   //here we are adding the SelectedHotelTypes to the SelectedHotelTypes array
             : prevFacilities.filter((facility) => facility !== facilityType));    //if the user unchecked  //here we are checking whether the checkbox is checked or not, if it is checked then we are adding the hotelTypes to the selectedStar array and if it is not checked then we are removing the starRating from the selectedStar array
    }           //takes the current stars or the previous state of stars and the filter out the star which we selected,then its going to return a new array with all the stars except those stars and set everything to state

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            <div className="sticky p-5 border rounded-lg border-slate-300 h-fit top-10">
                <div className="space-y-5">
                    <h3 className="pb-5 text-lg font-semibold border-b border-slate-300">
                        Filter By:
                    </h3>
                    <StarRatingFilter selectedStar={selectedStar} onChange={handleStarsChange} />
                    <HotelTypesFilter selectedHotelTypes={selectedHotelTypes} onChange={handleHotelTypeChange}/>
                    <FacilitiesFilter  selectedFacilities={selectedFacilities} onChange={handleFacilityChange}/>
                    <PriceFilter selectedPrice={selectedPrice} onChange={(value?: number)=>setSelectedPrice(value)}/>
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                    {hotelData?.pagination.total ? search.destination ? `Hotels found in ${search.destination}` : `${hotelData?.pagination.total} Hotels found`  : "" } 
                    
                    {/* {hotelData?.pagination.total} Hotels found
                    {search.destination ? ` in ${search.destination}` : ""} */}
                    
                    </span>
                    
                    <select value={sortOption} onChange={(event) => setSortOption(event.target.value)} className="p-2 border rounded-md">    {/*here we are sending the value of sortOptions to backend hotels.ts where the value obtain from the state will be passed to "let sortOption = {};" to backend hotels.ts */}
                        <option value="">SortBy</option>
                        <option value="starRating">Star Rating</option>   {/*here the starRating pricePerNightAsc pricePerNightDesc is taken from hotels.ts switch function*/}
                        <option value="pricePerNightAsc">Price Per Night (Low to High)</option>
                        <option value="pricePerNightDesc">Price Per Night (High to Low)</option>
                    </select>

                </div>
                {hotelData?.data.map((hotel) => (
                    <SearchResultCard key={hotel._id} hotel={hotel} />
                ))}
                <div>
                    <Pagination page={hotelData?.pagination.page || 1} 
                    pages={hotelData?.pagination.pages || 1}
                    onPageChange={(page) => setPage(page)} />
                </div>
            </div>
        </div>
    );
};

export default Search;