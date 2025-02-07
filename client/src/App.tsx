import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Game from './components/Game';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';
import Chat from './components/Chat';
import AdminPanel from '../../games/AdminPanel';
import Navbar from './components/Navbar.js';
import Home from './components/home.js';

function App() {
    return (
        <Router>
            <MainRoutes />
        </Router>
    );
}

// Component to handle routes and conditional rendering of Navbar
function MainRoutes() {
    const location = useLocation();
    
    // Hide Navbar for Login and Signup pages
    const hideNavbarRoutes = ['/', '/signup'];
    const showNavbar = !hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/home" element={<Home />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['player']} />}>
                    <Route path="/game" element={<Game />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/panel" element={<AdminPanel />} />
                    <Route path="/home" element={<Home />} /></Route>
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </>
    );
}

export default App;
