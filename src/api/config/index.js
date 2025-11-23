import axios from 'axios';
import { message } from 'antd';
import { getAccessToken, clearAuth } from '../../utils/storage';
import { API_ENDPOINTS } from '../../utils/constants';

// 创建 axios 实例
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        // 添加 sa-token 的 token 到请求头
        const token = getAccessToken();
        if (token) {
            // sa-token 默认使用 satoken 作为 header 名称，根据你的后端配置调整
            config.headers['satoken'] = token;
            // 或者使用标准的 Authorization
            // config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        const { code, data, msg, success, message: msg2 } = response.data || {};
        if (success === true) {
            return response.data; // 直接返回 { success, message, results }
        }
        if (code === 200 || code === 0) {
            return data; // 保持原先的风格
        }
        const errMsg =
            (typeof msg2 === 'string' && msg2) ||
            (typeof msg === 'string' && msg) ||
            '请求失败';

        throw new Error(errMsg);
    },
    async (error) => {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Token 过期或无效
                    message.error('登录已过期，请重新登录');
                    clearAuth();
                    window.location.href = '/login';
                    break;

                case 403:
                    message.error('没有权限访问该资源');
                    break;

                case 404:
                    message.error('后端无响应');
                    break;

                case 500:
                    message.error('服务器错误，请稍后重试');
                    break;

                default:
                    message.error(data?.msg || '请求失败');
            }
        } else if (error.request) {
            message.error('网络错误，请检查网络连接');
        } else {
            message.error('请求配置错误');
        }

        return Promise.reject(error);
    }
);

export default apiClient;