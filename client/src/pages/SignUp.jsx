//import React from 'react'
import { Link,useNavigate } from 'react-router-dom';
import {useState} from 'react';

function SignUp() {
  const [formData,setFormData]=useState({});  //useState is a hook that allows us to use state in a functional component
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();


  const handleChange = (e) => {
    setFormData({...formData,
      [e.target.id]:e.target.value})
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();  {/*the fetch function is used to communicate with a server, sending a POST request to the "/api/auth/signup" endpoint with JSON-formatted data in the request body.*/}

    try {
      setLoading(true);
      const res=await fetch("/api/auth/sign-up",{                
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formData)
    });
      const data=await res.json();

      if(data.success===false){
        setError(data.message);
        setLoading(false);
      return;
    }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
  } catch(error) {
      setLoading(false);
      setError(error.message);
  }
};

  return (
    <div className="p-3 max-w-lg mx-auto">   {/*style applied for the whole page*/}
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">   {/*style applied for the form only*/}
        <input type="text" placeholder="Username" className="border p-3 rounded-lg" id="username" onChange={handleChange}/>
        <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email" onChange={handleChange}/>
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
        {/* <input type="password" placeholder="confirm password" className="border p-3 rounded-lg" id="confirmPassword" /> */}
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-95 disabled:opacity-80">{loading ? "Loading...":"Sign Up"}</button>
      </form>
      <div className='flex gap-2 mt-4'>    {/*mt margin top*/}
        <p>Already have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>

  )
}

export default SignUp;