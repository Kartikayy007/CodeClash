import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const AuthFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid Email address"),
  password: z
    .string()
    .min(8, "Password must meet all requirements")
    .regex(/[A-Z]/, "Password must meet all requirements")
    .regex(/[0-9]/, "Password must meet all requirements")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must meet all requirements"),
    Newpassword: z
    .string()
    .min(8, "Password must meet all requirements")
    .regex(/[A-Z]/, "Password must meet all requirements")
    .regex(/[0-9]/, "Password must meet all requirements")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must meet all requirements"),
  confirmPassword: z.string().min(8, "Password must meet all requirements"),
  pin: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});