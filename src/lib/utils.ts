import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const AuthFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid Email address"),
  password: z.string().optional(),  // Make it optional since we don't always use it
  Newpassword: z
    .string()
    .min(8, "Password must meet all requirements")
    .regex(/[A-Z]/, "Password must meet all requirements")
    .regex(/[0-9]/, "Password must meet all requirements")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must meet all requirements"),
  confirmPassword: z.string().min(8, "Password must meet all requirements"),
  terms: z.boolean().optional()  // Add terms field
}).refine((data) => {
  // Only check password match if we're using confirmPassword
  if (data.confirmPassword) {
    return data.Newpassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});