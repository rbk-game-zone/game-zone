import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

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
                    {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App
