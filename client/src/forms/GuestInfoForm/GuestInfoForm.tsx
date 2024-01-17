import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchContext } from "../../Context/SearchContext";
import { useAppContext } from "../../Context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";


type Props = {
    hotelId: string;    // hotelId is passed as a prop because we need to navigate to the booking confirmation page after the form is submitted
    pricePerNight: number;
}

type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
}

const GuestInfoForm = ({hotelId, pricePerNight}: Props) => {
    const search = useSearchContext();
    const {isLoggedIn} = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    
    const {watch,register,handleSubmit,setValue,formState: {errors}} = useForm<GuestInfoFormData>({
        defaultValues: {            //where this basically means the values the user has search previously will be the default values and passed to this form(repopulate this form)
            checkIn: search.checkIn,
            checkOut: search.checkOut,
            adultCount: search.adultCount,
            childCount: search.childCount
        }
    });

    const checkIn = watch("checkIn");   // watch is used to watch the value of the input field
    const checkOut = watch("checkOut");

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const onLoginClick = (data: GuestInfoFormData) => {       //how the data flow works from here shows in the tutorial https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=14&t=18000s at 12.13.12
        search.saveSearchValues(
            "",              // destination is not required here
            data.checkIn,
            data.checkOut,
            data.adultCount,
            data.childCount
        );
        navigate("/login", {state: {from: location}})   // here we are passing the current location as a state to the login page so that we can redirect the user to the same page after login, which when the login button is clicked redirected to the login page and when the user is logged in then again redirected to the same page with same hotelId and pricePerNight details page he was referring to
    };

    const onSubmit = (data: GuestInfoFormData) => {
        search.saveSearchValues(
            "",              // destination is not required here
            data.checkIn,
            data.checkOut,
            data.adultCount,
            data.childCount
        );
        navigate(`/hotel/${hotelId}/booking`)   
    };

    return(
        <div className="flex flex-col p-4 bg-blue-300 gap-4">
            <h3 className="text-md font-bold">£{pricePerNight} pricePerNight</h3>

            <form onSubmit = {isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onLoginClick)}>
                <div className="grid grid-cols-1 gap-4 items-center">
                    <div>
                        <DatePicker
                            required
                            selected={checkIn}
                            onChange={(date) => setValue("checkIn",date as Date)}    //here "checkIn" is the property we need to update
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-in Date"
                            className="min-w-full bg-white p-2 focus:outline-none"
                            wrapperClassName="min-w-full" 
                        />
                    </div>
                    <div>
                        <DatePicker
                            required
                            selected={checkOut}
                            onChange={(date) => setValue("checkOut",date as Date)}    //here "checkIn" is the property we need to update
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-in Date"
                            className="min-w-full bg-white p-2 focus:outline-none"
                            wrapperClassName="min-w-full" 
                        />
                    </div>
                    <div className="flex bg-white px-2 py-1 gap-2">
                        <label className="items-center flex">
                            Adults:
                            <input
                                className="w-full p-1 focus:outline-none font-bold"
                                type="number"
                                min={1}
                                max={20}
                                {...register("adultCount",{       // register is used to register the input field with react-hook-form
                                    required: "This Field is required",
                                    min:{
                                        value:1,
                                        message: "There must be atleast one adult"
                                    },
                                    valueAsNumber: true
                                })}
                            />
                        </label>
                        <label className="items-center flex">
                            Children:
                            <input
                                className="w-full p-1 focus:outline-none font-bold"
                                type="number"
                                min={0}
                                max={20}
                                {...register("childCount",{       // register is used to register the input field with react-hook-form
                                    valueAsNumber: true
                                })}
                            />
                        </label>
                        {errors.adultCount && <span className="text-red-500">{errors.adultCount.message}</span>}
                    </div>
                    {isLoggedIn ? (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
                            Book Now
                        </button>
                    ) : (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
                            Login to Book
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default GuestInfoForm;

// TODO: users can select same date for checkIn and checkOut make that unable