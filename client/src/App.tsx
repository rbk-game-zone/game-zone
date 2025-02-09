import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Admin from "./components/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import "./App.css";
import AdminPanel from "./components/AdminPanel.jsx";
import Navbar from "./components/Navbar.js";
import Home from "./components/home.js";
import Category from "./components/Category.tsx";
import axios from "axios";
import { useState } from "react";
import {AppContentProps} from "./types/tables/appContentProps.ts"



function App() {
  const [games, setGames] = useState([]);

  const fetchGameByCategory = async (category:string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/category/${category}`
      ); // Replace with your actual API endpoint
      setGames(response.data);
      console.log(response.data);
      // Store categories in state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <Router>
      <AppContent
        games={games}
        fetchGameByCategory={fetchGameByCategory}
      />
    </Router>
  );
}

function AppContent({ games, fetchGameByCategory }:AppContentProps) {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/signup", "/forgot-password", "/reset-password"];

  // Check if the current path is in the hideNavbarPaths array
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* Conditionally render the Navbar */}
      {!shouldHideNavbar && <Navbar fetchGameByCategory={fetchGameByCategory} />}

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/panel" element={<AdminPanel />} />
        </Route>
        <Route path="/category" element={<Category games={games} />} />
        <Route element={<ProtectedRoute allowedRoles={["player"]} />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;