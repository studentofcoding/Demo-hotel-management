//import React from 'react'

import { Link } from "react-router-dom";

function HomeNav() {
  return (
    <div className="bg-slate-300 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-4 font-semibold">
            <ul className="flex gap-20">
            <Link to="/about">
              <li className="hidden sm:inline text-white hover:underline">About</li>
            </Link>  

            <Link to="/rooms&suites">  
              <li className="hidden sm:inline text-white hover:underline">Rooms & suites</li>
            </Link>

            <Link to="/dining">
              <li className="hidden sm:inline text-white hover:underline">Dining</li>
            </Link>

            <Link to="/events">
              <li className="hidden sm:inline text-white hover:underline">Events</li>
            </Link>

            <Link to="/gallery">
              <li className="hidden sm:inline text-white hover:underline">Gallery</li>
            </Link>

            <Link to="/offers">
              <li className="hidden sm:inline text-white hover:underline">Offers</li>
            </Link>
            </ul>
        </div>
    </div>
  )
}

export default HomeNav;