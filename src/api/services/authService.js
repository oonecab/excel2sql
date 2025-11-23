import apiClient from '../config';
import { API_ENDPOINTS } from '../../utils/constants';

// 登录
export const login = async (credentials) => {
    if (process.env.REACT_APP_USE_MOCK_AUTH === 'true') {
        const { username, password } = credentials;
        if (username === 'dev@local' && password === '123456') {
            return {
                token: 'dev-token',
                refreshToken: 'dev-refresh',
                userInfo: {
                    username: '开发者',
                    role: 'admin',
                    email: 'dev@local'
                }
            };
        }
        throw new Error('用户名或密码错误');
    }
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
    return response;
};

// 登出
export const logout = async () => {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
    return response;
};

// 刷新 Token
export const refreshToken = async (refreshToken) => {
    const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    return response;
};

// 获取用户信息
export const getUserInfo = async () => {
    const response = await apiClient.get(API_ENDPOINTS.GET_USER_INFO);
    return response;
};