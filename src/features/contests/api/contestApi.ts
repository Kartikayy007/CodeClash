import { api } from '@/utils/api';
import { ContestResponse, ValidateContestCodeResponse, RegisterContestResponse } from '../types/contest.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const contestApi = {
  validateContestCode: async (code: string): Promise<ValidateContestCodeResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.post<ValidateContestCodeResponse>(
      `${BASE_URL}/api/v1/contest/validate`,
      { code },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  getContestDetails: async (contestId: string): Promise<ContestResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.get<ContestResponse>(
      `${BASE_URL}/api/v1/contest/${contestId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  registerForContest: async (contestId: string): Promise<RegisterContestResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.post<RegisterContestResponse>(
      `${BASE_URL}/api/v1/contest/${contestId}/register`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  }
}; 