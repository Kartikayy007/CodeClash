import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { runCode as runCodeApi, submitCode as submitCodeApi } from '../api/editorApi';
import type { RunCodePayload, RunCodeResponse, SubmitCodePayload, SubmitCodeResponse } from '@/features/editor/types/editor.types';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

interface SubmissionResponse {
  submissionId: string;
  status: string;
  testCasesPassed: number;
  totalTestCases: number;
  executionTime: number;
  failedTestCase: string | null;
}

interface EditorState {
  code: string;
  language: string;
  isRunning: boolean;
  isSubmitting: boolean;
  output: string | null;
  error: string | null;
  submissionResponse: SubmissionResponse | null;
  activeTab: 'description' | 'submissions' | 'submission-details';
}

const initialState: EditorState = {
  code: '',
  language: 'cpp',
  isRunning: false,
  isSubmitting: false,
  output: null,
  error: null,
  submissionResponse: null,
  activeTab: 'description',
};

export const runCode = createAsyncThunk<
  RunCodeResponse,
  RunCodePayload,
  { rejectValue: string }
>('editor/runCode', async (data, { rejectWithValue }) => {
  try {
    const response = await runCodeApi(data);
    return response;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to run code'
    );
  }
});

export const submitCode = createAsyncThunk<
  SubmitCodeResponse,
  SubmitCodePayload,
  { rejectValue: string }
>('editor/submitCode', async (data, { rejectWithValue, dispatch }) => {
  try {
     console.log("🚀 Starting code submission:", data);
    dispatch(setActiveTab('submissions'));
    
    const response = await submitCodeApi(data);
     console.log("✅ Submission API response:", response);
    return response;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
     console.log("❌ Submission error:", axiosError.response?.data);
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to submit code'
    );
  }
});

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setOutput: (state, action: PayloadAction<string | null>) => {
      state.output = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSubmissionResponse: (state, action: PayloadAction<SubmissionResponse | null>) => {
      state.submissionResponse = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'description' | 'submissions' | 'submission-details'>) => {
      state.activeTab = action.payload;
    },
    resetEditor: (state) => {
      state.code = '';
      state.output = null;
      state.error = null;
      state.submissionResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runCode.pending, (state) => {
        state.isRunning = true;
        state.output = null;
        state.error = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.isRunning = false;
        if (action.payload.body) {
          if (!action.payload.body.error) {
            state.output = action.payload.body.output;
            state.error = null;
          } else {
            state.error = action.payload.body.error;
            state.output = null;
          }
        }
      })
      .addCase(runCode.rejected, (state, action) => {
        state.isRunning = false;
        state.error = action.payload || 'Failed to run code';
        state.output = null;
      })
      .addCase(submitCode.pending, (state) => {
         console.log("⏳ Submission pending, setting initial state");
        state.isSubmitting = true;
        state.submissionResponse = {
          submissionId: '',
          status: 'PROCESSING',
          testCasesPassed: 0,
          totalTestCases: 0,
          executionTime: 0,
          failedTestCase: null
        };
         console.log("🔄 Current submission state:", state.submissionResponse);
        state.error = null;
      })
      .addCase(submitCode.fulfilled, (state, action) => {
         console.log("✨ Submission fulfilled, updating state with:", action.payload);
        state.isSubmitting = false;
        if (action.payload) {
          state.submissionResponse = {
            submissionId: action.payload.submissionId,
            status: action.payload.status,
            testCasesPassed: action.payload.testCasesPassed,
            totalTestCases: action.payload.totalTestCases,
            executionTime: action.payload.executionTime,
            failedTestCase: action.payload.failedTestCase,
          };
                 console.log("📊 Updated submission state:", state.submissionResponse);
        }
      })
      .addCase(submitCode.rejected, (state, action) => {
          console.log("💥 Submission rejected:", action.payload);
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to submit code';
        state.submissionResponse = null;
      });
  },
});

export const {
  setCode,
  setLanguage,
  setIsRunning,
  setIsSubmitting,
  setOutput,
  setError,
  setSubmissionResponse,
  setActiveTab,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer; 
