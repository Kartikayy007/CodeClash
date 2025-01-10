import { FieldErrors } from "react-hook-form"
import { z } from "zod"
import { AuthFormSchema } from "@/lib/schemas/authSchema"
import { toast } from "@/providers/toast-config"

interface ErrorHandlerProps {
  errors: FieldErrors<z.infer<typeof AuthFormSchema>>
  form: any
}

export const handleResetPasswordError = ({ errors, form }: ErrorHandlerProps) => {
  if (!form.getValues('Newpassword') || !form.getValues('confirmPassword')) {
    toast.error('Required Fields', 'Please fill in both password fields')
    return true
  }

  if (form.getValues('Newpassword') !== form.getValues('confirmPassword')) {
    toast.error('Password Mismatch', 'Passwords do not match')
    return true
  }

  if (errors.Newpassword) {
    toast.error('Invalid Password', 'Password must meet all requirements')
    return true
  }

  return false
}

export const handleLoginError = ({ errors, form }: ErrorHandlerProps) => {
  if (errors.password) {
    toast.error('Invalid Password', 'Password must meet all requirements')
    return true
  }
  
  if (!form.getValues('email') && !form.getValues('password')) {
    toast.error('Required Fields', 'Please fill in all required fields')
    return true
  }

  if (!form.getValues('password')) {
    toast.error('Required Fields', 'Please fill in all required fields')
    return true
  }

  if (errors.username) {
    toast.error('Invalid Username', 'Username must be at least 3 characters')
    return true
  }

  return false
}

export const handleRegisterError = ({ errors, form }: ErrorHandlerProps) => {
  if (!form.getValues('email') && !form.getValues('username') && !form.getValues('password')) {
    toast.error('Required Fields', 'Please fill in all required fields')
    return true
  }

  if (errors.email) {
    toast.error('Invalid Email', errors.email.message || 'Please enter a valid email address')
    return true
  }

  if (!form.getValues('terms')) {
    toast.error('Terms Required', 'Please accept the Terms and Conditions to continue')
    return true
  }

  if (errors.username) {
    toast.error('Invalid Username', 'Username must be at least 3 characters')
    return true
  }

  if (errors.password) {
    toast.error('Invalid Password', 'Password must meet all requirements')
    return true
  }

  return false
}

export const handleCommonErrors = ({ errors, form }: ErrorHandlerProps) => {
  if (errors.email) {
    toast.error('Invalid email', errors.email.message || 'Enter a valid email address.')
    return true
  }
  
  if (errors.username) {
    toast.error('Invalid Username', errors.username.message || 'Username is required.')
    return true
  }
  
  if (errors.password) {
    toast.error('Invalid Password', 'Password must be at least 8 characters, include uppercase, number, and special character')
    return true
  }

  return false
}