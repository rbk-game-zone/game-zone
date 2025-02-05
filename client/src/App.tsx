import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Game from './components/Game';
import Profile from './components/Profile';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/home';

function App() {
    return (
        <Router>
        <Navbar/>
            <Routes>
            <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* Protected routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<Admin />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['player']} />}>
                    <Route path="/game" element={<Game />} />
                </Route>
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
        
    );
}

export default App
