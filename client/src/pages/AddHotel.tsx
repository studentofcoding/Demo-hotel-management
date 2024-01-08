import { useMutation } from "react-query";
import { useAppContext } from "../Context/AppContext";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import * as apiClient from "../api-client";

const AddHotel = () => {
    const { showToast } = useAppContext();

    const { mutate,isLoading } = useMutation(apiClient.addHotel,{
        onSuccess: () => {
            showToast({message:"Hotel created successfully",type:"SUCCESS"});
        },
        onError: () => {
            showToast({message:"Hotel creation failed",type:"ERROR"});
        }
    });

    const handleCreate = (hotelFormData: FormData)=>{     //here we are passing the formData that we created after we submitted the form to the handleCreate function
        mutate(hotelFormData);
    }

    return(
        <ManageHotelForm onSave={handleCreate} isLoading={isLoading} />
    )
};

export default AddHotel;
