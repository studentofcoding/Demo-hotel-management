import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const TypeSection = () => {
    const {register,watch,formState:{errors}} = useFormContext<HotelFormData>();   
    const typeWatch = watch("type");   // watch is a function from useFormContext to watch/get the value of the input element when the type changes the value of the input element will be updated
 
    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Type</h2>
            <div className="grid grid-cols-5 gap-2">
                {hotelTypes.map((type) => (       // map through the hotelTypes array which is imported from hotel-options-config.tsx
                    <label className={typeWatch === type ? "cursor-pointer bg-blue-300 text-sm rounded-full px-4 py-2 font-semibold" 
                    : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold"}>  {/* if the selected type equals to the current type in the map function apply the first set of styles otherwise apply the second set of styles */}
                        <input type="radio" value={type} className="hidden" {...register("type", { required: "This field is required" })} />
                        <span>{type}</span>
                    </label>
                ))}
            </div>
            {errors.type && (
                <span className="text-red-500 text-sm font-bold">{errors.type.message}</span>
            )}
        </div>
    )
};

export default TypeSection;