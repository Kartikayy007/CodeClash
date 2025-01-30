import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { runCode as runCodeApi } from '../api/editorApi';
import type { RunCodePayload, RunCodeResponse } from '@/features/editor/types/editor.types';
import { AxiosError } from 'axios';

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
    return rejectWithValue(
      (error as AxiosError).response?.data?.message || 'Failed to run code'
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
        if (action.payload.data) {
          if (action.payload.data.status === 'success') {
            state.output = action.payload.data.output;
            state.error = null;
          } else {
            state.error = action.payload.data.error || 'Unknown error occurred';
            state.output = null;
          }
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