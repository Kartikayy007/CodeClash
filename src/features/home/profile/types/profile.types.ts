export interface Profile {
  id: string;
  username: string;
  wins: number;
  email: string;
  skillLevel: string | null;
  rating: number;
  winStreak: number;
  maxWinStreak: number;
  totalMatches: number;
  losses: number;
  winRate: number;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
}

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
} 