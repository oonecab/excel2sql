import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/storage';
import { ROUTES } from '../utils/constants';

const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to={ROUTES.LOGIN}
        replace />;
};

export default PrivateRoute;