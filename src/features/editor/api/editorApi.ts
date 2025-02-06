import { api } from '@/utils/api';
import type { RunCodePayload, RunCodeResponse, SubmitCodePayload, SubmitCodeResponse } from '@/features/editor/types/editor.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

const submitCode = async (data: SubmitCodePayload): Promise<SubmitCodeResponse> => {
  const token = localStorage.getItem('accessToken');
  console.log('Submitting code with data:', data);
  const response = await api.post<SubmitCodeResponse>(
    `${BASE_URL}/api/v1/match/submit`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  console.log('Submit response:', response.data);
  return response.data;
};

export { runCode, submitCode }; 