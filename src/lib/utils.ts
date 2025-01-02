import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const AuthFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  pasword: z.string().min(8)
})