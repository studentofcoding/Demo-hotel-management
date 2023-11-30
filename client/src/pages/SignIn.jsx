//import React from 'react'
import { Link,useNavigate } from 'react-router-dom';
import {useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { signInStart,signInSuccess,signInError } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

function SignIn() {
  const [formData,setFormData]=useState({});  //useState is a hook that allows us to use state in a functional component
  const {loading,error}=useSelector((state)=>state.user);  //this is redux
  // const [error,setError]=useState(null);
  // const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleChange = (e) => {
    setFormData({...formData,
      [e.target.id]:e.target.value})
  };
  
  const handleSubmit = async  (e) => {
    e.preventDefault(); 
    {/*the fetch function is used to communicate with a server, sending a POST request to the "/api/auth/signup" endpoint with JSON-formatted data in the request body.*/}
    try {
      dispatch(signInStart());  //this is redux
      // setLoading(true);
      const res=await fetch("/api/auth/sign-in",{                
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formData)
    });
      const data=await res.json();

      if(data.success===false){
        dispatch(signInError(data.message));    //this is redux
        // setError(data.message);
        // setLoading(false);
      return;
    }
      dispatch(signInSuccess(data));    //this is redux
      // setLoading(false);
      // setError(null);
      navigate("/");
  } catch(error) {
      dispatch(signInError(error.message));   //this is redux
      // setLoading(false);
      // setError(error.message);
  }
};
  
  return (
    <div className="p-3 max-w-lg mx-auto">   {/*style applied for the whole page*/}
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">   {/*style applied for the form only*/}
  
        <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email" onChange={handleChange}/>
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
        {/* <input type="password" placeholder="confirm password" className="border p-3 rounded-lg" id="confirmPassword" /> */}
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-95 disabled:opacity-80">{loading ? "Loading...":"Sign In"}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-4'>    {/*mt margin top*/}
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
    
  )
}

export default SignIn;