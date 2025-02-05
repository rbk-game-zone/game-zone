import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Game from './components/Game';
import Profile from './components/Profile';
import './App.css'
import Chat from "./components/Chat";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<Admin />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['player']} />}>
                    <Route path="/game" element={<Game />} />
                    <Route path="/chat" element={<Chat />} />

                </Route>
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
