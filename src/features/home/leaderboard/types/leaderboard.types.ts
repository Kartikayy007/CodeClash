export interface LeaderboardPlayer {
  id: string;
  username: string;
  wins: number;
}

export interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardPlayer[];
  userRank: number;
  pagination: PaginationInfo;
}

export interface LeaderboardState {
  players: LeaderboardPlayer[];
  userRank: number;
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
}

export interface FetchLeaderboardParams {
  page: number;
  limit: number;
  searchQuery?: string;
} 