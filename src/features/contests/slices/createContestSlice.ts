import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Problem } from '@/types/problem.types';

interface TimeField {
  date: string;
  time: string;
}

interface FormData {
  name: string;
  description: string;
  rules: string;
  prizes: string;
  score: string;
  startTime: TimeField;
  endTime: TimeField;
  organizationName: string;
}

interface CreateContestState {
  formData: FormData;
  problems: Problem[];
  activeTab: 'details' | 'problems' | 'settings';
  activeSection: 'basic' | 'description';
  selectedProblemIndex: number | null;
  isDirty: boolean;
}

interface FormFieldUpdate {
  name: Exclude<keyof FormData, 'startTime' | 'endTime'>;
  value: string;
}

interface TimeFieldUpdate {
  name: 'startTime' | 'endTime';
  field: 'date' | 'time';
  value: string;
}

const initialState: CreateContestState = {
  formData: {
    name: '',
    description: '',
    rules: '',
    prizes: '',
    score: '',
    startTime: {
      date: '',
      time: ''
    },
    endTime: {
      date: '',
      time: ''
    },
    organizationName: ''
  },
  problems: [],
  activeTab: 'details',
  activeSection: 'basic',
  selectedProblemIndex: null,
  isDirty: false
};

const createContestSlice = createSlice({
  name: 'createContest',
  initialState,
  reducers: {
    updateFormField: (state, action: PayloadAction<FormFieldUpdate>) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
      state.isDirty = true;
    },
    updateTimeField: (state, action: PayloadAction<TimeFieldUpdate>) => {
      const { name, field, value } = action.payload;
      state.formData[name][field] = value;
      state.isDirty = true;
    },
    setActiveTab: (state, action: PayloadAction<'details' | 'problems' | 'settings'>) => {
      state.activeTab = action.payload;
    },
    setActiveSection: (state, action: PayloadAction<'basic' | 'description'>) => {
      state.activeSection = action.payload;
    },
    addProblem: (state, action: PayloadAction<Problem>) => {
      state.problems.push(action.payload);
      state.isDirty = true;
    },
    updateProblem: (state, action: PayloadAction<{ index: number; problem: Problem }>) => {
      const { index, problem } = action.payload;
      state.problems[index] = problem;
      state.isDirty = true;
    },
    deleteProblem: (state, action: PayloadAction<number>) => {
      state.problems.splice(action.payload, 1);
      state.isDirty = true;
    },
    setSelectedProblemIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedProblemIndex = action.payload;
    },
    initializeForm: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = {
        ...state.formData,
        ...action.payload
      };
      state.isDirty = false;
    },
    markAsSaved: (state) => {
      state.isDirty = false;
    }
  }
});

export const {
  updateFormField,
  updateTimeField,
  setActiveTab,
  setActiveSection,
  addProblem,
  updateProblem,
  deleteProblem,
  setSelectedProblemIndex,
  initializeForm,
  markAsSaved
} = createContestSlice.actions;

export default createContestSlice.reducer; 