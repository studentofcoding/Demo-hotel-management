import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../Context/AppContext";

const EditHotel = () => {
    const { showToast } = useAppContext();  
    const { hotelId } = useParams();
    const { data: hotelData } = useQuery("getMyHotelById",() => apiClient.getMyHotelById(hotelId || ""), {
        enabled: !!hotelId,    //if hotelId is null then it will not run
    });

    const { mutate,isLoading } = useMutation(apiClient.updateHotelById,{
        onSuccess: () => {
            showToast({message: "Hotel updated successfully",type: "SUCCESS"})
        },
        onError: () => {
            showToast({message: "Hotel update failed",type: "ERROR"})
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };

    return <ManageHotelForm hotel={hotelData} onSave={handleSave} isLoading={isLoading} />;   //here we are passing the hotelData to the ManageHotelForm
};

export default EditHotel;