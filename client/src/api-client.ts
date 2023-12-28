//all the fetch requests are made here
import { RegisterFormData } from "./pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;  //here we are taking the api base url from the .env file the reason we are using this particular way is because base url is going to change when we rendering the project

export const register = async (formData: RegisterFormData) => {     //here we are taking the type using RegisterFormData
    const response = await fetch(`${API_BASE_URL}/api/users/register`,{
        method:"POST",
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