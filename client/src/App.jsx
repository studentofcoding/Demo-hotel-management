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
import Gallery from './pages/Gallery.jsx';
import RoomsSuites from './pages/RoomsSuites';
import Header from './components/Header';
import HomeNav from './components/HomeNav.jsx';
import PrivateRoute from './private/PrivateRoute.jsx';


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <HomeNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/dining" element={<Dining />} />
        <Route path="/event" element={<Events />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/rooms&suites" element={<RoomsSuites />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route element={<PrivateRoute />}>              {/*blocking the access to the profile page if the user is not logged in */}
        <Route path="/profile" element={<Profile />} />   
      </Route>
      </Routes>
    </BrowserRouter>
  )
}
