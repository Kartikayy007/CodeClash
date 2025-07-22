// Admin API Types
export interface Contest {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'ONGOING' | 'ENDED' | 'UPCOMING';
  creator: {
    id: string;
    username: string;
  };
}

export interface ContestsResponse {
  contests: Contest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LeaderboardEntry {
  user: {
    id: string;
    username: string;
  };
  score: number;
  rank: number;
  problemsSolved: number;
  lastSubmissionTime: string | null;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TestCase {
  id: string;
  questionId: string;
  input: string;
  output: string;
  isHidden: boolean;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  testCases: TestCase[];
}

export interface Submission {
  id: string;
  questionId: string;
  language: string;
  code: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR';
  createdAt: string;
  score: number;
  passedTestCases: number;
  totalTestCases: number;
  question: Question;
}

export interface UserDetailsResponse {
  userDetails: {
    username: string;
    email: string;
  };
  contestSubmissions: Submission[];
  totalSubmissions: number;
  totalScore: number;
  totalPassedTestCases: number;
  totalFailedTestCases: number;
  meta: {
    totalSubmissions: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
