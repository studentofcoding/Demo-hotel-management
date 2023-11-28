// import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Dining from './pages/Dining';
import Events from './pages/Events';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import RoomsSuites from './pages/RoomsSuites';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/dining" element={<Dining />} />
        <Route path="/event" element={<Events />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/rooms&suites" element={<RoomsSuites />} />
      </Routes>
    </BrowserRouter>
  )
}
