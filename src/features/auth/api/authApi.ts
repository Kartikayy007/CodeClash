import { api } from '@/utils/api';
import { RegisterPayload, RegisterResponse } from '../types/auth.types';

export const authApi = {
  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },
};