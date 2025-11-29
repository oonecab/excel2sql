import apiClient from '../config';
import { API_ENDPOINTS } from '../../utils/constants';

export const uploadSchemaExcel = async (formData) => {
  const resp = await apiClient.post(API_ENDPOINTS.TEXT2SQL_SCHEMA_UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return resp;
};

export const generateSql = async ({ requirements, schema, dbType }) => {
  const resp = await apiClient.post(API_ENDPOINTS.LLM_GENERATE_SQL, {
    requirements,
    schema,
    dbType
  });
  return resp;
};