import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const AuthFormSchema = z.object({
  email: z.string()
    .min(6, "Email must be at least 6 characters")
    .email("Invalid email format"),
  username: z.string()
    .min(3, "Username must be at least 3 characters"),
  password: z.string()
    .min(8, "Password must meet all requirements")
    .regex(/[A-Z]/, "Password must meet all requirements")
    .regex(/[0-9]/, "Password must meet all requirements")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must meet all requirements"),
  Newpassword: z.string(),
  confirmPassword: z.string(),
  terms: z.boolean(),
  pin: z.string().optional(),
});
