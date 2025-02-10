import { api } from '@/utils/api';
import { LeaderboardResponse, FetchLeaderboardParams } from '../types/leaderboard.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const leaderboardApi = {
  getLeaderboard: async (params: FetchLeaderboardParams): Promise<LeaderboardResponse> => {
    const token = localStorage.getItem('accessToken');
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.searchQuery && { search: params.searchQuery })
    });

    const response = await api.get<LeaderboardResponse>(
      `${BASE_URL}/api/v1/user/leaderboard?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  }
}; 