import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Language } from '../types/editor.types';

interface Question {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface Match {
  id: string;
  status: string;
  winnerId: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  status: string;
  createdAt: string;
  testCasesPassed: number;
  totalTestCases: number;
  code?: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
}

interface SubmissionDetails extends Submission {
  code: string;
  match: Match;
  language: string;
  testCasesPassed: number;
  totalTestCases: number;
  input?: string;
  score: number;
  expectedOutput?: string;
  actualOutput?: string;
}

interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface SubmissionState {
  submissions: Submission[];
  selectedSubmission: SubmissionDetails | null;
  latestSubmission: {
    submissionId: string;
    status: string;
    testCasesPassed: number;
    totalTestCases: number;
    executionTime: number;
    failedTestCase: string | null;
  } | null;
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
}

const initialState: SubmissionState = {
  submissions: [],
  selectedSubmission: null,
  latestSubmission: null,
  pagination: {
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  },
  loading: false,
  error: null
};

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('accessToken');

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchAll',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await axios.get(`${BASE_URL}/api/v1/user/submissions?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
);

export const fetchSubmissionById = createAsyncThunk(
  'submissions/fetchById',
  async (submissionId: string) => {
    const response = await axios.get(`${BASE_URL}/api/v1/user/submissions/${submissionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
);

export const fetchSubmissionsByMatchId = createAsyncThunk(
  'submissions/fetchByMatchId',
  async (matchId: string) => {
    const response = await axios.get(`${BASE_URL}/api/v1/user/submissions/match/${matchId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
);

const submissionSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    clearSelectedSubmission: (state) => {
      state.selectedSubmission = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setLatestSubmission: (state, action: PayloadAction<any>) => {
      state.latestSubmission = action.payload;
      console.log('Setting latest submission:', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.submissions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch submissions';
      })
      .addCase(fetchSubmissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubmission = action.payload.submission;
      })
      .addCase(fetchSubmissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch submission details';
      })
      .addCase(fetchSubmissionsByMatchId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByMatchId.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.submissions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubmissionsByMatchId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch match submissions';
      });
  },
});

export const { clearSelectedSubmission, setPage, setLatestSubmission } = submissionSlice.actions;

export default submissionSlice.reducer; 