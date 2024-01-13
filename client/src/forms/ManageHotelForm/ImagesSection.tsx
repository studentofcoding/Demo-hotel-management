import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const ImagesSection = () => {
    const { register, formState: { errors }, watch, setValue } = useFormContext<HotelFormData>();
    const existingImageUrls = watch("imageUrls")    //from here we need to update the HotelFormData type in ManageHotelForm.tsx with a new data type imageUrls: string[]

    const handleDelete= (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,   //event: React.MouseEvent<HTMLButtonElement, MouseEvent>: This is the standard event object that is automatically passed by React when a button is clicked. It's not used in this function, but it's there in case you need it.   //this is how we define a mouse click in react typescript  
        imageUrl: string    //imageUrl: string: This is the URL of the image that needs to be deleted.
        ) =>{
        event.preventDefault();  //This line prevents the default behavior associated with the mouse event. In the context of a button click, it prevents the default action, which could be, for example, submitting a form or following a link.
        setValue("imageUrls", existingImageUrls.filter((url) => url !== imageUrl));   //This line creates a new array of image URLs by filtering out the URL that matches the imageUrl parameter. It removes the specific image URL you want to delete.   //after filtering the filtered uls will be sent imageUrls    //the "imageUrls" from here will be sent to the form
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Images Section</h2>
            <div className="border rounded p-4 flex flex-col gap-4">
                {existingImageUrls && (
                    <div className="grid grid-cols-6 gap-4">
                        {existingImageUrls.map((Url) => (
                            <div className="relative group">
                                <img src={Url} className="min-h-full object-cover" />
                                <button onClick={(event) => handleDelete(event, Url)} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-80 text-white">   {/*here we are passing the event when clicked and the Url to the handleDelete function*/}
                                    Delete
                                </button>
                            </div>
                        ))}     {/*here we are looping through the existingImageUrls and displaying the images for further explanation in which how thw data is passed, watch the tutorial https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=17&t=18000s at 8.22.10*/}
                    </div> 
                )}
                <input type="file" multiple accept="image/*" className="w-full text-gray-700 font-normal" {...register("imageFiles", { 
                    validate: (imageFiles) => {
                        const totalLength = imageFiles.length + (existingImageUrls?.length || 0);   //(existingImageUrls? length : 0) this is how the other way we can use the logic
                        if(totalLength === 0){
                            return "At least one image is required";
                        }
                        if(totalLength > 6){
                            return "Total number of images should be less than 6";
                        }
                        return true;
                    }
                })} />
            </div>
            {errors.imageFiles && (
                <span className="text-red-500 text-sm font-bold">{errors.imageFiles.message}</span>
            )}
        </div>
    );
};

export default ImagesSection;