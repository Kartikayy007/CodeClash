import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { runCode as runCodeApi } from '../api/editorApi';
import type { RunCodePayload, RunCodeResponse } from '@/features/editor/types/editor.types';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

interface EditorState {
  code: string;
  language: string;
  output: string | null;
  error: string | null;
  isRunning: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: EditorState = {
  code: '',
  language: 'cpp',
  output: null,
  error: null,
  isRunning: false,
  status: 'idle',
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

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    clearOutput: (state) => {
      state.output = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runCode.pending, (state) => {
        state.isRunning = true;
        state.status = 'loading';
        state.output = null;
        state.error = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.isRunning = false;
        state.status = 'succeeded';
        
        // Handle the new response format
        if (action.payload.body) {
          if (!action.payload.body.error) {
            state.output = action.payload.body.output;
            state.error = null;
          } else {
            state.error = action.payload.body.error;
            state.output = null;
          }
        } else if (action.payload.output) {
          // Fallback to top-level output/error
          state.output = action.payload.output;
          state.error = action.payload.error || null;
        }
      })
      .addCase(runCode.rejected, (state, action) => {
        state.isRunning = false;
        state.status = 'failed';
        state.error = action.payload || 'Failed to run code';
        state.output = null;
      });
  },
});

export const { setCode, setLanguage, clearOutput } = editorSlice.actions;
export default editorSlice.reducer; 