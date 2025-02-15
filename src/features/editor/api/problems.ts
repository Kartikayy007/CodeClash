import axios from "axios";

export interface TestCase {
  id: string;
  questionId: string;
  input: string;
  output: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  rating: number;
  timeLimit: number;
  memoryLimit: number;
  createdAt: string;
  updatedAt: string;
  testCases: TestCase[];
}


export async function fetchProblem(problemId: string): Promise<Problem> {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/question/${problemId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
   ('🎯 Fetched problem:', response.data);
  return response.data.data;
}