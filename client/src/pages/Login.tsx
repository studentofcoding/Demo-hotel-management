import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../Context/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormData = {
    email: string;
    password: string;
  };


const Login = () => {
    const queryClient=useQueryClient();
    const {register,formState:{errors},handleSubmit}=useForm<SignInFormData>();
    const {showToast}=useAppContext();
    const navigate=useNavigate();

    const mutation=useMutation(apiClient.Login,{
        onSuccess: async()=>{
            showToast({message:"Login Successful",type:"SUCCESS"});
            await queryClient.invalidateQueries("validateToken"); //refresh tokens after a successful registration. //here this "validateToken" is passed through AppContext.tsx this refreshers the browser when the user logs out automatically //here isLoggedIn is set to false in AppContext.tsx
            navigate("/")
        },onError: (err:Error)=>{     //to handle the errors from backend    //here the "Error" is considered with the Error in api=client.ts Error
            showToast({message:err.message,type:"ERROR"})
        }
    });
    
    const onSubmit= handleSubmit((data)=>{
        mutation.mutate(data);
    })
    
    return(
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input type="email" className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email",{required:"This Field is Required"})} />
                    {errors.email && (<span className="text-red-500 text-sm">{errors.email.message}</span>)}  {/*here we are checking if there is any error in the firstName field and if there is any error then we are displaying the error message*/}
                </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input type="password" className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password",{required:"This Field is Required with atleast 8 characters",
                    minLength:{
                        value:8,
                        message:"Password must be 8 characters long"
                    }})} />
                    {errors.password && (<span className="text-red-500 text-sm">{errors.password.message}</span>)}  {/*here we are checking if there is any error in the firstName field and if there is any error then we are displaying the error message*/}
                </label>
                <span className="flex items-center justify-between">
                <span className="text-sm">
                    Not Registered?
                        <Link className="underline p-1" to="/register">
                            Create an account here
                        </Link>
                </span>
                    <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                        Login
                    </button>
                </span>
        </form>
    )
};      

export default Login;