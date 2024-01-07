import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../Context/AppContext";

const SignOutButton = () => {
    const queryClient=useQueryClient();
    const {showToast}=useAppContext();
    const mutation=useMutation(apiClient.logOut,{
        onSuccess: async()=>{
            await queryClient.invalidateQueries("validateToken"); //here this "validateToken" is passed through AppContext.tsx this refreshers the browser when the user logs out automatically //here isLoggedIn is set to false in AppContext.tsx
            showToast({message:"Logout Successful",type:"SUCCESS"})   //here the signOut is linked to route/auth.ts where the auth_token is removed from the cookie then the "validateToken" is called which returns the error "Invalid Token" then the isLoggedIn is set to false in AppContext.tsx and the user is redirected to the login page 
        },
        onError: (err:Error)=>{
            showToast({message:err.message,type:"ERROR"})
        }
    });

    const handleClick=()=>{
        mutation.mutate();
    };

    return (
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100">
        Sign Out
        </button>
    );
};

export default SignOutButton;