export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isPublic: boolean;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  createdAt: string;
  organizationName: string | null;
  rules: string | null;
  prizes: string | null;
  score: string | null;
  creator: {
    id: string;
    username: string;
    rating: number;
  };
  isRegistered: boolean;
  isCreator: boolean;
  userStats: null | {
    rank: number;
    score: number;
    timeTaken: string;
    questionsSolved: number;
    submissions: Array<{
      questionId: string;
      status:
        | "ACCEPTED"
        | "WRONG_ANSWER"
        | "TIME_LIMIT_EXCEEDED"
        | "RUNTIME_ERROR";
      submittedAt: string;
    }>;
  };
  participantCount: number;
  questionCount: number;
  questions: Array<{
    id: string;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    rating: number;
    score: number;
  }>;
}

export interface SubmissionItem {
  id: string;
  userId: string;
  matchId: string | null;
  contestId: string;
  questionId: string;
  code: string;
  language: string;
  status:
    | "ACCEPTED"
    | "WRONG_ANSWER"
    | "RUNTIME_ERROR"
    | "COMPILATION_ERROR"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED"
    | "SEGMENTATION_FAULT"
    | "INFINITE_LOOP";
  executionTime: number | null;
  memory: string | null;
  failedTestCase: number | null;
  passedTestCases: number | null;
  totalTestCases: number | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  question?: {
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
  };
}

export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface UserContestSubmissionsResponse {
  success: boolean;
  submissions: SubmissionItem[];
  pagination: Pagination;
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
    questions: Array<{
      id: string;
      title: string;
      description: string;
      inputFormat: string;
      outputFormat: string;
    }>;
  };
}

export interface ContestResponse {
  message: string;
  contest: Contest;
}

export interface RegisterContestResponse {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
  };
}

export interface UpdateContestPayload {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  rules: string;
  prizes: string;
  score: string;
  organizationName: string;
}

export interface AddQuestionPayload {
  contestId: string;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  rating: number;
  score: number;
  timeLimit: number;
  memoryLimit: number;
  testCases: Array<{
    input: string;
    output: string;
    isHidden: boolean;
  }>;
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
  rank: string | number | null;
  username: string;
  timeTaken: string;
  score: number;
  questionsSolved: number;
  id?: string;
  contestId?: string;
  userId?: string;
  problemsSolved?: number;
  lastSubmissionTime?: string;
  updatedAt?: string;
  user?: {
    username: string;
    rating: number;
    profileImage: string | null;
  };
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
  success: boolean;
  message: string;
  updatedUsers: number;
}

export interface AddQuestionFromLibraryPayload {
  contestId: string;
  questionId: string;
}

export interface AddQuestionFromLibraryResponse {
  message: string;
  contest: Contest;
}
