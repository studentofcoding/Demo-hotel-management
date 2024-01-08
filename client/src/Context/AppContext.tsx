import React, { useContext } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";   //here we are defining the type of the message these are predefined types in the register.tsx
};

type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;  
};

const AppContext = React.createContext<AppContext | undefined >(undefined);  //here we are creating a context and passing the default value as undefined
  
export const AppContextProvider = ({children}:{children: React.ReactNode}) =>{      //do all sort of hooks,states and other things  //AppContextProvider is a component which is used to wrap the components which we want to use the all the things in the context
    const [toast,setToast]=React.useState<ToastMessage | undefined>(undefined);   //here we are creating a state for the toast message and passing the default value as undefined

    const {isError}= useQuery("validateToken",apiClient.validateToken,{   //this validate token is in link with api-client.ts   //useQuery handles all the errors   //here we are using the useQuery hook to call the validateToken fetch functions from the api-client.ts file,for more info refer the video https://www.youtube.com/watch?v=YdBy9-0pER4&t=30s at 2.56.50})
        retry:false,    //here we are setting the retry to false so that it will not retry the fetch if there is any error
    });     //here we are calling the validateToken function which we get from the api-client.ts file here it is going return there is an error or not
    //"validateToken" acts as a unique identifier for a specific query managed by React Query, facilitating data fetching, caching, and error handling within your application.

    return(
        <AppContext.Provider value={{showToast: (toastMessage)=> {
            setToast(toastMessage); 
        },
        isLoggedIn: !isError,   //here we are checking if there is any error or not and if there is no error then we are setting the isLoggedIn to true
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(undefined)}/>} {/*make the re-rendering*/}  {/*"onClose={()=>setToast(undefined)} an arrow function like () => setToast(undefined) denotes a function without any arguments. When this arrow function is passed as a prop, such as onClose, the empty parentheses () signify that the function doesn’t require any arguments when it's invoked."*/}
            {children} 
        </AppContext.Provider>
    )
};

export const useAppContext = () => {     //here we are creating a custom hook to use the context
    const context= useContext(AppContext);  //here we are using the useContext hook to use the context
    return context as AppContext;   //here we are returning the context as AppContext
}   

//here the AppContext is globally available to all the components in the app
//The context object, created through React.createContext, facilitates the sharing of data or functions between different parts of the component tree. 
//It allows components to access these shared values without needing to pass props explicitly through intermediate components. 
//This is particularly useful for global data like themes, user authentication, language preferences, etc., which many components across the application might need access to.
//It helps in managing the state or providing global data without the need for prop drilling (passing props through multiple layers of components), improving code maintainability and reducing code complexity.