import { Problem, ProblemPreview, TestCase } from "@/features/battle/editor/api/problems";
import problemsDataRaw from "../../problems.json";

// Type for problems.json structure
interface JsonProblem {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  rating: number;
  timeLimit: number;
  memoryLimit: number;
  testCases: Array<{
    input: string;
    output: string;
    isHidden: boolean;
  }>;
  url?: string;
  platform?: string;
}

// Convert JSON problem to Problem interface
function convertJsonProblemToProblem(jsonProblem: JsonProblem, index: number): Problem {
  const problemId = `practice-${index}`;
  const now = new Date().toISOString();
  
  return {
    id: problemId,
    title: jsonProblem.title,
    description: jsonProblem.description,
    inputFormat: jsonProblem.inputFormat,
    outputFormat: jsonProblem.outputFormat,
    constraints: jsonProblem.constraints,
    difficulty: jsonProblem.difficulty,
    rating: jsonProblem.rating,
    timeLimit: jsonProblem.timeLimit,
    memoryLimit: jsonProblem.memoryLimit,
    createdAt: now,
    updatedAt: now,
    testCases: jsonProblem.testCases.map((tc, tcIndex) => ({
      id: `${problemId}-tc-${tcIndex}`,
      questionId: problemId,
      input: tc.input,
      output: tc.output,
      isHidden: tc.isHidden,
      createdAt: now,
      updatedAt: now,
    })),
  };
}

// Convert Problem to ProblemPreview
function convertToProblemPreview(problem: Problem): ProblemPreview {
  return {
    id: problem.id,
    title: problem.title,
    rating: problem.rating,
    difficulty: problem.difficulty,
    score: problem.rating, // Use rating as score for practice problems
    submissions: {},
    createdAt: problem.createdAt,
  };
}

// Load all problems from JSON
let cachedProblems: Problem[] | null = null;

export function loadAllProblems(): Problem[] {
  if (cachedProblems) {
    return cachedProblems;
  }
  
  // Type assertion for JSON import
  const jsonProblems = (problemsDataRaw as unknown) as JsonProblem[];
  cachedProblems = jsonProblems.map((p, index) => convertJsonProblemToProblem(p, index));
  return cachedProblems;
}

// Get a problem by ID (format: practice-{index})
export function getProblemById(problemId: string): Problem | null {
  const problems = loadAllProblems();
  return problems.find(p => p.id === problemId) || null;
}

// Get problems with pagination
export function getProblems(page: number = 1, limit: number = 10): {
  problems: ProblemPreview[];
  total: number;
  totalPages: number;
} {
  const allProblems = loadAllProblems();
  const total = allProblems.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProblems = allProblems.slice(startIndex, endIndex);
  const problemPreviews = paginatedProblems.map(convertToProblemPreview);
  
  return {
    problems: problemPreviews,
    total,
    totalPages,
  };
}

// Filter problems by difficulty
export function filterProblemsByDifficulty(
  difficulty: "EASY" | "MEDIUM" | "HARD" | "ALL",
  page: number = 1,
  limit: number = 10
): {
  problems: ProblemPreview[];
  total: number;
  totalPages: number;
} {
  const allProblems = loadAllProblems();
  const filtered = difficulty === "ALL" 
    ? allProblems 
    : allProblems.filter(p => p.difficulty === difficulty);
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProblems = filtered.slice(startIndex, endIndex);
  const problemPreviews = paginatedProblems.map(convertToProblemPreview);
  
  return {
    problems: problemPreviews,
    total,
    totalPages,
  };
}

// Search problems by title
export function searchProblems(
  query: string,
  page: number = 1,
  limit: number = 10
): {
  problems: ProblemPreview[];
  total: number;
  totalPages: number;
} {
  const allProblems = loadAllProblems();
  const searchLower = query.toLowerCase();
  const filtered = allProblems.filter(p => 
    p.title.toLowerCase().includes(searchLower) ||
    p.description.toLowerCase().includes(searchLower)
  );
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProblems = filtered.slice(startIndex, endIndex);
  const problemPreviews = paginatedProblems.map(convertToProblemPreview);
  
  return {
    problems: problemPreviews,
    total,
    totalPages,
  };
}

// Combined filter function that applies search, difficulty, and rating filters
export function filterProblems(
  options: {
    searchQuery?: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD" | "ALL";
    ratingMin?: number;
    ratingMax?: number;
  },
  page: number = 1,
  limit: number = 10
): {
  problems: ProblemPreview[];
  total: number;
  totalPages: number;
} {
  const allProblems = loadAllProblems();
  let filtered = allProblems;

  // Apply search filter
  if (options.searchQuery && options.searchQuery.trim()) {
    const searchLower = options.searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply difficulty filter
  if (options.difficulty && options.difficulty !== "ALL") {
    filtered = filtered.filter(p => p.difficulty === options.difficulty);
  }

  // Apply rating range filter
  if (options.ratingMin !== undefined && !isNaN(options.ratingMin)) {
    filtered = filtered.filter(p => p.rating >= options.ratingMin!);
  }
  if (options.ratingMax !== undefined && !isNaN(options.ratingMax)) {
    filtered = filtered.filter(p => p.rating <= options.ratingMax!);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProblems = filtered.slice(startIndex, endIndex);
  const problemPreviews = paginatedProblems.map(convertToProblemPreview);
  
  return {
    problems: problemPreviews,
    total,
    totalPages,
  };
}
