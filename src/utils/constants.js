export const API_ENDPOINTS = {
	LOGIN: '/auth/login',
	LOGOUT: '/auth/logout',
	REFRESH_TOKEN: '/auth/refresh',
	GET_USER_INFO: '/auth/userinfo',
	REGISTER: '/auth/register',
	EXCEL_UPLOAD: '/api/excel/upload',
	TEXT2SQL_SCHEMA_UPLOAD: '/api/text2sql/upload-schema',
	LLM_GENERATE_SQL: '/api/llm/generate-sql'
};

export const STORAGE_KEYS = {
	ACCESS_TOKEN: 'access_token',
	REFRESH_TOKEN: 'fresh_token',
	USER_INFO: 'user_info'
};

export const ROUTES = {
	LOGIN: '/login',
	LANDING: '/',
	DASHBOARD: '/dashboard',
	EXCEL2SQL: '/excel2sql',
	TEXT2SQL: '/text2sql',
	GALLERY: '/gallery',
	REGISTER: '/register'
};