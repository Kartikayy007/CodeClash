import { z } from "zod";

export const SubmitCodeSchema = z.object({
  code: z.string(),
  language: z.string(),
  matchId: z.string(),
  questionId: z.string(),
});
