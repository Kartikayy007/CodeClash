import { api } from "@/utils/api";
import type {
  RunCodePayload,
  RunCodeResponse,
  SubmitCodePayload,
  SubmitCodeResponse,
} from "@/features/battle/editor/types/editor.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const runCode = async (data: RunCodePayload): Promise<RunCodeResponse> => {
  const token = localStorage.getItem("accessToken");

  const response = await api.post<RunCodeResponse>(
    `${BASE_URL}/api/v1/contest/${data.contestId}/questions/${data.questionId}/run`,
    {
      code: data.code,
      language: data.language,
      input: data.input,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

const submitCode = async (
  data: SubmitCodePayload,
): Promise<SubmitCodeResponse> => {
  const token = localStorage.getItem("accessToken");

  console.log("Submitting code with data:", data);
  const response = await api.post<SubmitCodeResponse>(
    `${BASE_URL}/api/v1/contest/${data.contestId}/questions/${data.questionId}/submit`,
    {
      code: data.code,
      language: data.language,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log("Submit response:", response.data);
  return response.data;
};

const submitBattleCode = async (
  data: SubmitCodePayload,
): Promise<SubmitCodeResponse> => {
  const token = localStorage.getItem("accessToken");

  // Use the /match/submit API for battle mode
  const response = await api.post<SubmitCodeResponse>(
    `${BASE_URL}/api/v1/match/submit`,
    {
      code: data.code,
      language: data.language,
      matchId: data.contestId, // contestId is actually matchId in battle mode
      questionId: data.questionId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export { runCode, submitCode, submitBattleCode };
