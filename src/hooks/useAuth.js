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
    // 登录
    const handleLogin = useCallback(async (credentials) => {
        setLoading(true);
        try {
            const data = await authService.login(credentials);

            // 保存 token
            setToken(data.token, data.refreshToken);

            // 保存用户信息
            setUserInfo(data.userInfo);
            setUser(data.userInfo);

            message.success('登录成功');

            // 跳转到首页或指定页面
            navigate(ROUTES.LANDING);

            return { success: true };
        } catch (error) {
            message.error(error.message || '登录失败');
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // 登出
    const handleLogout = useCallback(async () => {
        try {
            await authService.logout();
            clearAuth();
            setUser(null);
            message.success('已退出登录');
            navigate(ROUTES.LOGIN);
        } catch (error) {
            // 即使后端请求失败，也清除本地信息
            clearAuth();
            setUser(null);
            navigate(ROUTES.LOGIN);
        }
    }, [navigate]);

    // 检查登录状态
    const checkAuth = useCallback(() => {
        return isAuthenticated();
    }, []);

    return {
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: checkAuth
    };
};