//import React from 'react'
import { useSelector } from "react-redux";
import { Outlet,Navigate } from "react-router-dom";   //Outlet is used to render the child components of the parent component, here the parent component is privateRoute

function PrivateRoute() {
    const {currentUser} = useSelector((state) => state.user);   //to get the current user from the redux store
  return (
    currentUser ? <Outlet /> : <Navigate to="/sign-in" />   //if the user is logged in then the outlet is rendered, else the user is redirected to the sign-in page
  );
}

export default PrivateRoute;