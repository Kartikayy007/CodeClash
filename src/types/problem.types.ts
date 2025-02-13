export interface Problem {
  id?: string;
  name: string;
  maxScore: number;
  rating: number;
  description: string;
  inputFormat: string;
  constraints: string;
  outputFormat: string;
  testCases: Array<{
    input: string;
    output: string;
    sample: boolean;
    strength: number;
  }>;
}

export interface ProblemFormData {
  name: string;
  rating: string;
  maxScore: string;
  description: string;
  inputFormat: string;
  constraints: string;
  outputFormat: string;
  testCases: Array<{
    input: string;
    output: string;
    sample: boolean;
    strength: number;
  }>;
} 