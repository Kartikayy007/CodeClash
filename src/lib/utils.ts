import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const AuthFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  username: z.string().optional(),
  Newpassword: z.string().optional(),
  confirmPassword: z.string().optional(),
  terms: z.boolean().optional(),
  rememberMe: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.Newpassword || data.confirmPassword) {
    if (!data.Newpassword?.match(/[A-Z]/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain uppercase letter",
        path: ["Newpassword"],
      });
    }
    if (data.Newpassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  }
});
