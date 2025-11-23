import apiClient from '../config';
import { API_ENDPOINTS } from '../../utils/constants';

export const uploadExcel = async (formData, meta) => {
  if (meta?.dbType) formData.append('dbType', meta.dbType);
  if (meta?.tables) formData.append('tables', JSON.stringify(meta.tables));
  const resp = await apiClient.post(API_ENDPOINTS.EXCEL_UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return resp;
};