import { api } from '@/utils/api';
import { MatchesResponse, FetchMatchesParams } from '../types/matches.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const matchesApi = {
  getRecentMatches: async (params: FetchMatchesParams): Promise<MatchesResponse> => {
    const token = localStorage.getItem('accessToken');
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.status && { status: params.status }),
      ...(params.mode && { mode: params.mode }),
      ...(params.searchQuery && { search: params.searchQuery })
    });

    const response = await api.get<MatchesResponse>(
      `${BASE_URL}/api/v1/user/recent-matches?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  }
}; 