import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layout/layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./Context/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotels from "./pages/EditHotels";
import Search from "./pages/Search";
import Details from "./pages/Details";
import Booking from "./pages/Booking";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><p>Home Page</p></Layout>} />
        <Route path="/search" element={<Layout><Search /></Layout>} />
        <Route path="/details/:hotelId" element={<Layout><Details /></Layout>} />      {/*here we are passing the hotelId from the Details.tsx the useParams,api-client.ts getHotelById function*/}
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        {isLoggedIn && (
        <>
          <Route path="/hotel/:hotelId/booking" element={<Layout><Booking /></Layout>} />   
          <Route path="/add-hotel" element={<Layout><AddHotel /></Layout>} />
          <Route path="/my-hotels" element={<Layout><MyHotels /></Layout>} />
          <Route path="/edit-hotel/:hotelId" element={<Layout><EditHotels /></Layout>} />    {/*here we are passing the hotelId from the EditHotel.tsx the useParams*/}
        </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
export default App;
