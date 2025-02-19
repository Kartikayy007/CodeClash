import { api } from '@/utils/api';
import { ContestResponse, ValidateContestCodeResponse, RegisterContestResponse, CreateContestPayload, CreateContestResponse, UpdateContestPayload, AddQuestionPayload, DeleteQuestionPayload, DeleteQuestionResponse, LeaderboardResponse, UpdateLeaderboardResponse } from '../types/contest.types';

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
      `${BASE_URL}/api/v1/contest/${contestId}/join`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  createContest: async (data: CreateContestPayload): Promise<CreateContestResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.post<CreateContestResponse>(
      `${BASE_URL}/api/v1/contest/`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  },

  updateContest: async (contestId: string, data: UpdateContestPayload): Promise<ContestResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.put<ContestResponse>(
      `${BASE_URL}/api/v1/contest/${contestId}`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  },

  addQuestion: async (data: AddQuestionPayload): Promise<ContestResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.post<ContestResponse>(
      `${BASE_URL}/api/v1/contest/addQuestions`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  deleteQuestion: async (data: DeleteQuestionPayload): Promise<DeleteQuestionResponse> => {
  const token = localStorage.getItem('accessToken');
  const formData = new URLSearchParams();
  formData.append('contestId', data.contestId);
  formData.append('questionId', data.questionId);

  const response = await api.delete<DeleteQuestionResponse>(
    `${BASE_URL}/api/v1/contest/deleteQuestions`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData 
    }
  );
  return response.data;
},

  getLeaderboard: async (contestId: string, page: number = 1): Promise<LeaderboardResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.get<LeaderboardResponse>(
      `${BASE_URL}/api/v1/contest/${contestId}/leaderboard?page=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  updateLeaderboard: async (contestId: string): Promise<UpdateLeaderboardResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await api.post<UpdateLeaderboardResponse>(
      `${BASE_URL}/api/v1/contest/${contestId}/leaderboard`,
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