import { api } from '@/utils/api';
import { RegisterPayload, RegisterResponse, VerifyOtpPayload, VerifyOtpResponse } from '../types/auth.types';

const BASE_URL = 'https://goyalshivansh.me';

export const authApi = {
  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(`${BASE_URL}/api/v1/auth/register`, data);
    return response.data;
  },
  verifyOtp: async (data: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const response = await api.post<VerifyOtpResponse>(
      `${BASE_URL}/api/v1/auth/verify/register`, 
      data
    );
    return response.data;
  },
};