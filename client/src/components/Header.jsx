//import React from 'react'

import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="bg-black-300 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
            <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                <span className="text-slate-500">Prime</span>
                <span className="text-slate-700">Hotel</span>
            </h1>
            </Link>
            <ul className="flex gap-4">
            <Link to="/sign-in">
              <li className="hidden sm:inline text-white hover:underline">Sign-In</li>
            </Link>  

            <Link to="/sign-up">  
              <li className="hidden sm:inline text-white hover:underline">Register</li>
            </Link>

            <Link to="/reserves">
              <li className="hidden sm:inline text-white hover:underline">Find Reservations</li>
            </Link>
            </ul>
        </div>
    </div>
  )
}

export default Header;