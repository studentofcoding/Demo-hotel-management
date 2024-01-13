import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../api/src/shared/types";
import { useEffect } from "react";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    imageUrls: string[];    //here we need to update the HotelFormData type new data type imageUrls: string[] because we need to the existing images in the edit hotel form
    adultCount: number;
    childCount: number;
  };

  type props = {
    hotel?: HotelType;     //here we are passing the hotelData to the ManageHotelForm in the EditHotel.tsx
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
  };

  const ManageHotelForm = ({onSave,isLoading,hotel}: props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit, reset } = formMethods;     //is used to access the handleSubmit method   //is used to access the reset method

    useEffect(() => {   //here we are using useEffect to reset the form when the hotelData changes
        reset(hotel);   //here we are resetting the form when the hotelData changes
    }, [hotel, reset]);     
    
    
    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {  // append deals with building and structuring form data, primarily for submission  // initializes the form methods and state using the HotelFormData type, which defines the structure of the form data.
        const formData = new FormData();    //here we are converting formDataJson to FormData    //FormData is used to create a new FormData instance
        if(hotel) {
            formData.append("hotelId",hotel._id);   //here we are adding the hotelId to formData because we need to know which hotel we need to edit
        }

        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formData.append("type", formDataJson.type);
        formData.append("pricePerNight", String(formDataJson.pricePerNight.toString()));
        formData.append("starRating", String(formDataJson.starRating.toString()));
        formData.append("adultCount", String(formDataJson.adultCount.toString()));
        formData.append("childCount", String(formDataJson.childCount.toString()));
        formDataJson.facilities.forEach((facility,index) => {
            formData.append(`facilities[${index}]`, facility);    //here the loop goes a facilities1,facilities2 etc  //heres how we send a array in a form  //here the facilities is an array so we need to loop through the array and append each facility to the formData
        });

        //[image1.jpg,image2.jpg,image3.jpg], now if the user removes image2.jpg from the form then the imageUrls will be [image1.jpg,image3.jpg] and the imageFiles will be [image1.jpg,image3.jpg] so we need to append the imageUrls and imageFiles to the formData
        //imageUrls = [image1.jpg,image3.jpg]  
        if(formDataJson.imageUrls){
            formDataJson.imageUrls.forEach((url,index) => {
                formData.append(`imageUrls[${index}]`, url);    //here the loop goes a imageUrls1,imageUrls2 etc  //heres how we send a array in a form  //here the imageUrls is an array so we need to loop through the array and append each url to the formData
            });
        }

        Array.from(formDataJson.imageFiles).forEach((imageFile) => {     //here we are converting the imageFiles to an array and then looping through the array and appending each imageFile to the formData
            formData.append("imageFiles", imageFile);   //"imageFile" is the parameter passed from forEach function   //here we are converting the imageFiles to an array and then looping through the array and appending each imageFile to the formData
        });   //the reason we use append is because we broke the form data into multiple parts and we need to append all the parts to the formData when considering other forms like login.tsx we don't need to append the form data to the formData because we are not breaking the form data into multiple parts 
        onSave(formData); //here we are passing the formData to the onSave function
    });

    //**the whole data flow of addHotel form is explain in the video https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=10&t=18000s at 6.45.50

    return (
        <FormProvider {...formMethods}>   {/* all the form components will be spread to FormProvider, formMethods is spread into FormProvider to make these methods and state available to the components nested within FormProvider. This approach allows the nested components (DetailsSection, TypeSection, etc.) to access form methods and state without having to pass props down manually */}
        {/* All the components nested within this FormProvider will have access to the form methods and state. This allows the child components (DetailsSection, TypeSection, FacilitiesSection, GuestSection, ImagesSection) to interact with the form state, such as registering fields, watching for changes, validating inputs, and more, without having to pass down props explicitly. */}
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection />
                <TypeSection />
                <FacilitiesSection />
                <GuestSection />
                <ImagesSection />
                <span className="flex justify-end">
                    <button
                        type="submit" disabled={isLoading} className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500">
                            {isLoading ? "Creating..." : "Create"}
                    </button>
                </span>
            </form>
        </FormProvider>
        
    )
  }

export default ManageHotelForm;
  