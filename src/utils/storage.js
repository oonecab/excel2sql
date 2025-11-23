import { STORAGE_KEYS } from './constants';

export const setToken = (accessToken, refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
};

export const getAccessToken = () => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = () => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const setUserInfo = (userInfo) => {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
};

export const getUserInfo = () => {
    const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
};

export const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

export const isAuthenticated = () => {
    return !!getAccessToken();
};
