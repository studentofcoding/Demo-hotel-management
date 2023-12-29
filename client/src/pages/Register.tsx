import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {  //giving the form what type of data are expected
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

const Register = () => {
    const navigate = useNavigate();   
    const { showToast }=useAppContext();   //now the component has the access to the showToast property //here we are using the useAppContext hook to use the context which we created in AppContext.tsx
    const { register,watch,handleSubmit,formState:{errors} }=useForm<RegisterFormData>(); //here we destructure the form data  //methods(register,watch) provided by React Hook Form. It's used to register form inputs.

    const mutation = useMutation(apiClient.register,{    //handles the fetch which is done in api-client in Register.tsx  //here we are using the useMutation hook to call the register fetch functions from the api-client.ts file,for more info refer the video https://www.youtube.com/watch?v=YdBy9-0pER4&t=30s at 2.07.25
        onSuccess:()=>{                 //these types(SUCCESS,ERROR) are passed to AppContext to show as a toast message
            showToast({message: "Registration Successful",type:"SUCCESS"})//this message is passed to AppContext to show as a toast message  //here we are calling the showToast function which we get from the useAppContext hook and passing the message and type to it
            navigate("/")
        },  
        onError:(err:Error)=>{    //here the "Error" is considered with the Error in api=client.ts Error
            showToast({message: err.message,type:"ERROR"})  //here we are calling the showToast function which we get from the useAppContext hook and passing the message and type to it
        }   
    });   

    const onSubmit = handleSubmit((data) => {    //onSubmit is called when the button is clicked and pass the data to the handleSubmit which we get from useForm hook     //for a better understanding refer the video https://www.youtube.com/watch?v=YdBy9-0pER4&t=30s at 1.54.10
        mutation.mutate(data); //from here the data is called to "const mutation" and to api-client.ts     //here we are calling the mutation function which we get from the useMutation hook and passing the data to it
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">
                Create An Account
            </h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal" 
                    {...register("firstName",{required:"This Field is Required"})} />  {/*here using the useForm hook,easily registering input values*/}
                    {errors.firstName && (<span className="text-red-500 text-sm">{errors.firstName.message}</span>)}  {/*here we are checking if there is any error in the firstName field and if there is any error then we are displaying the error message,if you need to change the message change the required message*/}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                    {...register("lastName",{required:"This Field is Required"})} />
                    {errors.lastName && (<span className="text-red-500 text-sm">{errors.lastName.message}</span>)}  {/*here we are checking if there is any error in the firstName field and if there is any error then we are displaying the error message*/}
                </label>
            </div>
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
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Confirm Password
                    <input type="password" className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword",{required:"This Field is Required",
                        validate:(value)=>{
                            if(!value){
                                return "This Field is Required"
                            } else if (watch("password")!==value){  //watch is used to watch the value of the password field and compare it with the value of the password field
                                return "Passwords do not match"
                            }
                        }
                    })} />
                    {errors.confirmPassword && (<span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>)}  {/*here we are checking if there is any error in the firstName field and if there is any error then we are displaying the error message*/}
                </label>
                <span>
                    <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                        Register
                    </button>
                </span>
        </form>
    );
};

export default Register;