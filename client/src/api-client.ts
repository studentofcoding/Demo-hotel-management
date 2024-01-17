//all the fetch requests are made here
import { SignInFormData } from "./pages/Login";
import { RegisterFormData } from "./pages/Register";
import { HotelSearchResponse, HotelType, UserType } from "../../api/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";    //use the same service route  //here we are saying the fetch request that there is no API_BASE_URL so use the same server for all the requests

export const getCurrentUser = async (): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`,{
        credentials:"include",  //this is used to send the cookie to the server so that the server can identify the user
    });
    if(!response.ok){            //here we are checking if the response is ok or not which response.ok is a boolean value pre built
        throw new Error("Failed to fetch user(api-client.ts getCurrentUser)");
    }
    return response.json();      //here we are returning the response in json format
}

export const register = async (formData: RegisterFormData) => {     //here we are taking the type using RegisterFormData
    const response = await fetch(`${API_BASE_URL}/api/users/register`,{
        method:"POST",
        credentials:"include",  //this is used to send the cookie to the server so that the server can identify the user
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(formData),
    });
    const responseBody = await response.json();
    if(!response.ok){            //here we are checking if the response is ok or not which response.ok is a boolean value pre built
        throw new Error(responseBody.message);   //this Error is passed to the Register.tsx within mutation
    }
};

export const Login = async (formData: SignInFormData) => {    //here we are taking the type using SignInFormData
    const response =await fetch(`${API_BASE_URL}/api/auth/login`,{
        method:"POST",
        credentials:"include",  //this is used to send the cookie to the server so that the server can identify the user
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(formData),   //here we are converting the formData into JSON string
    });   
    const responseBody = await response.json();
    if(!response.ok){            //here we are checking if the response is ok or not which response.ok is a boolean value pre built
        throw new Error(responseBody.message);   //this Error is passed to the Login.tsx within mutation
    }
    return responseBody;
}   

export const validateToken = async () => {     //validate token endpoint
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`,{
        credentials:"include",  //this tells fetch request to send the any cookies available to the server
    });
    if(!response.ok){
        throw new Error("Invalid token");
    }

    return response.json();
};

export const logOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`,{
        credentials:"include",
        method:"POST",
    });

    if(!response.ok){
        throw new Error("Error logging out");
    }
};

export const addHotel = async (HotelFormData: FormData) => {      //here we are taking the type using HotelFormData,we are accepting the form data after the form submission
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        method:"POST",
        credentials:"include",
        body:HotelFormData,    //here we are just passing the form data,here it doesn't matter because we using append in the ManageHotelForm.tsx
    });
    if(!response.ok){
        throw new Error("Failed to add hotel(api-client.ts addHotel)");
    }
    return response.json();
}

export const getMyHotels = async ():Promise<HotelType[]> => {    //here () is empty because we are not sending any data to the server //the http cookie will sent automatically where we get the userId(from my-hotels.ts)
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{   //in the above we make promise to get the data as same as the HotelType because of this there is no data misrepresentation also in future if we want to add a new feature we can just make changes in the HotelType
        credentials:"include",
    });
    if(!response.ok){
        throw new Error("Failed to get hotels(api-client.ts getMyHotels)");
    }
    return response.json();
}


export const getMyHotelById = async (hotelId:string):Promise<HotelType> => {     //here we are taking the id of the hotel
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`,{
        credentials:"include",
    });
    if(!response.ok){
        throw new Error("Failed to get hotel (api-client.ts getMyHotelById)");
    }
    return response.json();
}    


export const updateHotelById = async (HotelFormData: FormData) => {         
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${HotelFormData.get("hotelId")}`,{    //here the hotelId is passed from manageHotelForm.tsx formData.append("hotelId",hotel._id);
        method:"PUT",
        credentials:"include",
        body:HotelFormData,    //here we are just passing the form data,here it doesn't matter because we using append already in the ManageHotelForm.tsx
    });
    if(!response.ok){
        throw new Error("Failed to update hotel(api-client.ts updateHotelById)");
    }
    return response.json();
};

export type searchParams = {
    destination?:string; 
    checkIn?:string;
    checkOut?:string;
    adultsCount?:string;
    childrenCount?:string;
    page?:string;
    facilities?:string[];
    types?:string[];
    stars?:string[];
    maxPrice?:string;
    sortOption?:string;
}

export const searchHotels = async (searchParams:searchParams): Promise<HotelSearchResponse> => {    //to expect what type of to be received by the query  //here we are taking the type using searchParams
    const queryParams = new URLSearchParams();   
    queryParams.append("destination",searchParams.destination || "");   //here we are appending the searchParams to the queryParams
    queryParams.append("checkIn",searchParams.checkIn || "");
    queryParams.append("checkOut",searchParams.checkOut || "");
    queryParams.append("adultsCount",searchParams.adultsCount || "");
    queryParams.append("childrenCount",searchParams.childrenCount || "");
    queryParams.append("page",searchParams.page || "");

    queryParams.append("maxPrice",searchParams.maxPrice || "");
    queryParams.append("sortOption",searchParams.sortOption || "");

    //*****all the 3 searchParams(facilities,types,stars) below are need to be made to a array of strings in the backend constructSearchQuery  */
    searchParams.facilities?.forEach((facility) => {     //if there any facilities selected by the user in the UI then we are appending it to the queryParams then we are passing it to the fetch request to the backend
        queryParams.append("facilities",facility);
    });
    searchParams.types?.forEach((type) => {     //if there any types selected by the user in the UI then we are appending it to the queryParams then we are passing it to the fetch request to the backend
        queryParams.append("types",type);
    });
    searchParams.stars?.forEach((star) => {     //if there any stars selected by the user in the UI then we are appending it to the queryParams then we are passing it to the fetch request to the backend
        queryParams.append("stars",star);
    });

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);        //here we are passing the queryParams to the fetch request

    if(!response.ok){
        throw new Error("Failed to search hotels(api-client.ts searchHotels)");
    }

    return response.json();
    
}

export const getHotelById = async (hotelId:string):Promise<HotelType> => {      //here we are taking the id of the hotel
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
    if(!response.ok){
        throw new Error("Failed to get hotel(api-client.ts getHotelById)");
    }
    return response.json();
}



//api-client=>AppContext(toastMessage) => Header 