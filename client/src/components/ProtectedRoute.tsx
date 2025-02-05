import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store/store';

interface ProtectedRouteProps {
    allowedRoles: ('admin' | 'player')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user } = useSelector((state: RootState) => state.auth);
console.log("user,",user)
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute; 