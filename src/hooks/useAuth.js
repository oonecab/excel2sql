import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import * as authService from '../api/services/authService';
import { setToken, setUserInfo, clearAuth, getUserInfo, isAuthenticated }
    from '../utils/storage';
import { ROUTES } from '../utils/constants';

export const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(getUserInfo());
    const handleLogin = useCallback(async (credentials) => {
        setLoading(true);
        try {
            const data = await authService.login(credentials);
            setToken(data.token, data.refreshToken);
            setUserInfo(data.userInfo);
            setUser(data.userInfo);
            message.success('登录成功');
            navigate(ROUTES.LANDING);
            return { success: true };
        } catch (error) {
            message.error(error.message || '登录失败');
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const handleLogout = useCallback(async () => {
        try {
            await authService.logout();
            clearAuth();
            setUser(null);
            message.success('已退出登录');
            navigate(ROUTES.LOGIN);
        } catch (error) {
            clearAuth();
            setUser(null);
            navigate(ROUTES.LOGIN);
        }
    }, [navigate]);

    const checkAuth = useCallback(() => {
        return isAuthenticated();
    }, []);

    const updateUser = useCallback((next) => {
        setUserInfo(next);
        setUser(next);
    }, []);

    return {
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: checkAuth,
        updateUser
    };
};