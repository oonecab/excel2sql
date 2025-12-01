import apiClient from '../config';
import { API_ENDPOINTS } from '../../utils/constants';

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

export const logout = async () => {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
    return response;
};

export const refreshToken = async (refreshToken) => {
    const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    return response;
};

export const getUserInfo = async () => {
    const response = await apiClient.get(API_ENDPOINTS.GET_USER_INFO);
    return response;
};

export const register = async ({ email, username, password }) => {
  if (process.env.REACT_APP_USE_MOCK_AUTH === 'true') {
    return { success: true };
  }
  const response = await apiClient.post(API_ENDPOINTS.REGISTER, { email, username, password });
  return response;
};

export const updateUserInfo = async ({ username, email }) => {
  if (process.env.REACT_APP_USE_MOCK_AUTH === 'true') {
    return { userInfo: { username, email } };
  }
  const response = await apiClient.put(API_ENDPOINTS.UPDATE_USER_INFO, { username, email });
  return response;
};