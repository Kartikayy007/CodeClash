import { StaticImageData } from "next/image";

export interface Contest {
  id: string;
  banner: StaticImageData;
  name: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  organizer: string;
  participants: number;
  rules: string[];
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface CreateContestPayload {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface CreateContestResponse {
  message: string;
  contest: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    isPublic: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    creatorId: string;
    questions: any[];
  };
}

export interface ContestResponse {
  success: boolean;
  message: string;
  data?: Contest;
}

export interface ValidateContestCodeResponse {
  success: boolean;
  message: string;
  data?: {
    contestId: string;
  };
}

export interface RegisterContestResponse {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
  };
}

export interface UpdateContestPayload {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  rules?: string;
  prizes?: string;
  score?: string;
}

export interface AddQuestionPayload {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  rating: number;
  score: number;
  timeLimit: number;
  memoryLimit: number;
  testCases: Array<{
    input: string;
    output: string;
    isHidden: boolean;
  }>;
  contestId: string;
  questionId?: string;
}

export interface DeleteQuestionPayload {
  contestId: string;
  questionId: string;
}

export interface DeleteQuestionResponse {
  message: string;
  data: {
    contestId: string;
    questionId: string;
    deletedAt: string;
  };
}

export interface LeaderboardEntry {
  rank: string;
  username: string;
  timeTaken: string;
  score: number;
  questionsSolved: number;
}

export interface LeaderboardPagination {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  pagination: LeaderboardPagination;
}

export interface UpdateLeaderboardResponse {
  message: string;
  updatedUsers: number;
} 