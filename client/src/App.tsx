import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
// import Game from './components/Game';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css'
// import Chat from "./components/Chat";
import AdminPanel from "../../games/AdminPanel";
import Navbar from './components/Navbar';
import Home from './components/home';
import Category from './components/Category.tsx';
import axios from 'axios';
import { useState } from 'react';
import { GameProvider } from './context/GameContext';
import SnakeGame from './components/SnakeGame'; // Ensure this import is correct

function App() {
    const [games, setGames] = useState([]);

    const fetchGameByCategory=async(category:any)=>{
        try {
          const response = await axios.get(`http://localhost:8000/api/category/${category}`); // Replace with your actual API endpoint
          setGames(response.data);
          console.log(response.data);
           // Store categories in state
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      
      }

    return (
        <GameProvider>
            <Router>
            <Navbar fetchGameByCategory={fetchGameByCategory}/>
                <Routes>
                <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    {/* Protected routes */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin" element={<Admin />} />
                    </Route>
                    <Route path="/category" element={<Category games={games} />} />
                    <Route element={<ProtectedRoute allowedRoles={['player']} />}>
                        {/* <Route path="/game" element={<Game />} /> */}
                        {/* <Route path="/chat" element={<Chat />} /> */}
                        <Route path="/panel" element={<AdminPanel />} />
                    </Route>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/game/:id" element={<SnakeGame gameId={1} />} /> {/* Example route */}
                </Routes>
            </Router>
        </GameProvider>
    );
}

export default App;
