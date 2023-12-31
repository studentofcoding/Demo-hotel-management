//all the fetch requests are made here
import { SignInFormData } from "./pages/Login";
import { RegisterFormData } from "./pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";    //use the same service route  //here we are taking the api base url from the .env file the reason we are using this particular way is because base url is going to change when we rendering the project

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
        body:JSON.stringify(formData),
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

//api-client=>AppContext(toastMessage) => Header 