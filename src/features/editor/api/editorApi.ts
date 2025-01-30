import { api } from '@/utils/api';
import type { RunCodePayload, RunCodeResponse } from '@/features/editor/types/editor.types';

const BASE_URL = 'https://goyalshivansh.me';

const runCode = async (data: RunCodePayload): Promise<RunCodeResponse> => {
  const token = localStorage.getItem('accessToken');
  const response = await api.post<RunCodeResponse>(
    `${BASE_URL}/api/v1/match/run`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export { runCode }; 