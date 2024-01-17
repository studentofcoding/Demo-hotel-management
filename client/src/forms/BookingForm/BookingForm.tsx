import { useForm } from "react-hook-form";
import { UserType } from "../../../../api/src/shared/types";

type Props = {
    currentUser: UserType;
};

type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;

};

const BookingForm = ({ currentUser }: Props) => {
    const {register} = useForm<BookingFormData>({
        defaultValues: {         // this is where we set the default values for the form
            firstName: currentUser.firstName,     //this is where we get the values from the currentUser
            lastName: currentUser.lastName,
            email: currentUser.email,
        },
    });

    return(
        <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
            <span className="text-3xl font-bold">CONFIRM YOUR DETAILS</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    FIRST NAME
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                    type="text" readOnly disabled {...register("firstName")} />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last NAME
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                    type="text" readOnly disabled {...register("lastName")} />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    EMAIL
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                    type="text" readOnly disabled {...register("email")} />
                </label>
            </div>
        </form>
    )
};

export default BookingForm;