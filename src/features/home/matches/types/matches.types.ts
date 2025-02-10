export type MatchMode = 'STANDARD' | 'SPEED' | 'ACCURACY';
export type MatchStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'ABORTED';

export interface Player {
  id: string;
  username: string;
}

export interface Match {
  players: Player[];
  mode: MatchMode;
  createdAt: string;
  status: MatchStatus;
  winnerId: string | null;
  abortedById: string | null;
  endTime: string | null;
  duration: string;
}

export interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface MatchesResponse {
  success: boolean;
  recentMatches: Match[];
  winsCount: number;
  lossesCount: number;
  totalMatches: number;
  pagination: PaginationInfo;
}

export interface MatchesState {
  matches: Match[];
  winsCount: number;
  lossesCount: number;
  totalMatches: number;
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
}

export interface FetchMatchesParams {
  page: number;
  limit: number;
  status?: MatchStatus;
  mode?: MatchMode;
  searchQuery?: string;
} 