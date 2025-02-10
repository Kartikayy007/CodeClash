import { api } from '@/utils/api';
import { ChangePasswordPayload, ChangeUsernamePayload, SettingsResponse } from '../types/settings.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const settingsApi = {
  changePassword: async (data: ChangePasswordPayload): Promise<SettingsResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.patch<SettingsResponse>(
      `${BASE_URL}/api/v1/user/password`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  changeUsername: async (data: ChangeUsernamePayload): Promise<SettingsResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.patch<SettingsResponse>(
      `${BASE_URL}/api/v1/user/username`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  deleteAccount: async (): Promise<SettingsResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.delete<SettingsResponse>(
      `${BASE_URL}/api/v1/user`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  }
}; 