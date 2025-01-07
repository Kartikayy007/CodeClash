import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const AuthFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().optional(),
  username: z.string().optional(),
  Newpassword: z.string().optional(),
  confirmPassword: z.string().optional(),
  terms: z.boolean().optional(),
  rememberMe: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.password && (ctx.path[0] === 'login' || ctx.path[0] === 'register')) {
    if (data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters",
        path: ["password"],
      });
    }
  }
  return true;
});


