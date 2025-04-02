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
  difficulty: "EASY" | "MEDIUM" | "HARD";
  rating: number;
  timeLimit: number;
  memoryLimit: number;
  createdAt: string;
  updatedAt: string;
  testCases: TestCase[];
}

export interface ProblemPreview {
  id: string;
  title: string;
  rating: number;
  score: number;
  createdAt: string;
}

export interface ProblemListResponse {
  success: boolean;
  data: {
    questions: ProblemPreview[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export async function fetchProblem(problemId: string): Promise<Problem> {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/question/${problemId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data.data;
}

export async function fetchProblemList(
  page: number = 1,
  limit: number = 10,
): Promise<ProblemListResponse> {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contest/questions/all?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}
