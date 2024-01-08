import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const FacilitiesSection = () => {
    const { register, formState: { errors } } = useFormContext<HotelFormData>();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Facilities</h2>
            <div className="grid grid-cols-5 gap-3">
                {hotelFacilities.map((facility) => (
                    <label className="text-sm flex gap-1 text-gray-700 items-center whitespace-nowrap">  {/* here whitespace-nowrap is used to Prevents wrapping of text and keeps it on a single line */}
                        <input type="checkbox" value={facility} {...register("facilities",{
                            validate: (facilities)=>{         //here the "facilities" same as the map function     //here the validate function is passing the current selected facilities to the function
                                if(facilities && facilities.length > 0){    //if the length of the facilities array is 0
                                    return true;
                                } else {
                                    return "At least one facility is required";    //return this message
                                }  
                            }
                        })} />
                        {facility}    {/* display all the facility to select */}
                    </label>
                ))}
            </div>
            {errors.facilities && (
                <span className="text-red-500 text-sm font-bold">{errors.facilities.message}</span>
            )}
        </div>
    )
};

export default FacilitiesSection;