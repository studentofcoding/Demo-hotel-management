//import React from 'react'
import { useSelector } from "react-redux";
import { useState } from "react";
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure,signOutUserSuccess } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser,loading,error } = useSelector(state => state.user);
  const [formData, setFormData] = useState({});
  console.log(formData);  //this console log is done right after the formData and the setFormData is done,so the formData is not updated yet
  const [updateSuccess, setUpdateSuccess] = useState(false);  //this is the success message that we get when the user is updated 
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });  //here we are updating the formData with the values of the input fields
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res=await fetch(`/api/user/update/${currentUser._id}`, //here we add api because we are using proxy in the package.json file in the client side
      {
        method:"POST",
        headers:{
          "Content-type":"application/json",
        },
        body:JSON.stringify(formData),
      });  //here we are sending the formData to the backend
      const data=await res.json();
      console.log(data);
      if(data.success===false){   //the data.success is refering to the error handling middleware in the index.js file in the backend
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));  //here we are updating the currentUser in the redux store
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async() => {     //all the data of the user is deleted from the local storage and the redux store
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{     //here we add api because we are using proxy in the package.json file in the client side
        method:"DELETE",
      });             
      const data=await res.json();     
      if(data.success===false){                  //the data.success is refering to the error handling middleware in the index.js file in the backend
        dispatch(deleteUserFailure(data.message));
        return;
      }     
      dispatch(deleteUserSuccess(data));  //here we are updating the currentUser in the redux store 

    } catch (error) {
      dispatch(deleteUserFailure(error.message));   
    }
  }

  const handleSignOut = async() => {
    try {
      dispatch(signOutUserStart());
      const res=await fetch("/api/auth/sign-out");  //here we add api because we are using proxy in the package.json file in the client side
      const data=await res.json();
      if(data.success===false){   //the data.success is refering to the error handling middleware in the index.js file in the backend
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());  //here we are updating the currentUser in the redux store
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  
  //*************todo:= in firebase the rules set to allow read and write everything not by the rules described early beacuse an error occures with authorization from the firebase ************//
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input onChange={handleChange} defaultValue={currentUser.username} type="text" placeholder=" Username" className="border p-3 rounded-lg" id="username" />    {/*if we value={currentUser.username} then the username will be displayed in the input field */}
        <input onChange={handleChange} defaultValue={currentUser.email} type="text" placeholder=" email" className="border p-3 rounded-lg" id="email" />
        <input onChange={handleChange} type="password" placeholder=" password" className="border p-3 rounded-lg" id="password" />

        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase 
        hover:opacity-90 disabled:opacity-80">{loading ? "Loading" : "Update"}</button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90" to={"/create-listing"}>
          Create Listing</Link>
      </form>        {/*self center works only when the parent is flex here */}
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? "User updated successfully" : ""}</p>
    </div>
  )
}

export default Profile;

