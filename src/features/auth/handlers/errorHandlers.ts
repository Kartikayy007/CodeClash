<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c6737e0 (Add error handling and submission logic for authentication forms)
import { FieldErrors, UseFormReturn, FieldValues } from "react-hook-form"
import { z } from "zod"
import { 
  LoginFormSchema, 
  RegisterFormSchema, 
  ResetPasswordFormSchema, 
  ForgotPasswordFormSchema, 
  GetStartedFormSchema 
} from "@/lib/schemas/authSchema"
import { toast } from "@/providers/toast-config"
import { ApiError } from "@/types/error.types"
import { isAxiosError } from "axios"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface BaseErrorHandlerProps<T extends FieldValues> {
  errors: FieldErrors<T>
  form: UseFormReturn<T>
}

type LoginFormValues = z.infer<typeof LoginFormSchema>
type RegisterFormValues = z.infer<typeof RegisterFormSchema>
type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>
type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordFormSchema>
type GetStartedFormValues = z.infer<typeof GetStartedFormSchema>

type LoginErrorHandlerProps = BaseErrorHandlerProps<LoginFormValues>
type RegisterErrorHandlerProps = BaseErrorHandlerProps<RegisterFormValues>
type ResetPasswordErrorHandlerProps = BaseErrorHandlerProps<ResetPasswordFormValues>
type ForgotPasswordErrorHandlerProps = BaseErrorHandlerProps<ForgotPasswordFormValues>
type GetStartedErrorHandlerProps = BaseErrorHandlerProps<GetStartedFormValues>

export const handleLoginError = ({ errors, form }: LoginErrorHandlerProps) => {
  if (!form.getValues('email') || !form.getValues('password')) {
    toast.error('Required Fields', 'Please fill in all required fields')
    return true
  }

  if (errors.email) {
    toast.error('Invalid Email', 'Enter a valid email address.')
    return true
  }

  if (errors.password) {
    toast.error('Invalid Credentials', 'Please check your email and password')
    return true
  }
  return false
}

export const handleRegisterError = ({ errors, form }: RegisterErrorHandlerProps) => {
  if (!form.getValues('email') || !form.getValues('username') || !form.getValues('password')) {
    toast.error('Required Fields', 'Please fill in all required fields')
    return true
  }
  
  if (errors.email) {
    toast.error('Invalid Email', 'Enter a valid email address.')
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
  
  if (!form.getValues('terms')) {
    toast.error('Terms Required', 'Please accept the Terms & Conditions')
    return true
  }
  return false
}

export const handleResetPasswordError = ({ errors, form }: ResetPasswordErrorHandlerProps) => {
=======
import { FieldErrors } from "react-hook-form"
import { z } from "zod"
import { AuthFormSchema } from "@/lib/schemas/authSchema"
import { toast } from "@/providers/toast-config"
<<<<<<< HEAD
=======
import { FieldErrors, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { LoginFormSchema, RegisterFormSchema, ResetPasswordFormSchema, ForgotPasswordFormSchema, GetStartedFormSchema } from "@/lib/schemas/authSchema"
import { toast } from "@/providers/toast-config"
import { ApiError } from "@/types/error.types"
import { isAxiosError } from "axios"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
>>>>>>> 70784f3 (implemented handeling for otp, removed unused import, fixed types)

interface BaseErrorHandlerProps<T> {
  errors: FieldErrors<T>
  form: UseFormReturn<T>
}

<<<<<<< HEAD
export const handleResetPasswordError = ({ errors, form }: ErrorHandlerProps) => {
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
=======
type LoginErrorHandlerProps = BaseErrorHandlerProps<z.infer<typeof LoginFormSchema>>
type RegisterErrorHandlerProps = BaseErrorHandlerProps<z.infer<typeof RegisterFormSchema>>
type ResetPasswordErrorHandlerProps = BaseErrorHandlerProps<z.infer<typeof ResetPasswordFormSchema>>
type ForgotPasswordErrorHandlerProps = BaseErrorHandlerProps<z.infer<typeof ForgotPasswordFormSchema>>
type GetStartedErrorHandlerProps = BaseErrorHandlerProps<z.infer<typeof GetStartedFormSchema>>

export const handleLoginError = ({ errors, form }: LoginErrorHandlerProps) => {
  if (!form.getValues('email') || !form.getValues('password')) {
=======

interface ErrorHandlerProps {
  errors: FieldErrors<z.infer<typeof AuthFormSchema>>
  form: any
}

export const handleResetPasswordError = ({ errors, form }: ErrorHandlerProps) => {
>>>>>>> c52728d (Add error handling and submission logic for authentication forms)
  if (!form.getValues('Newpassword') || !form.getValues('confirmPassword')) {
    toast.error('Required Fields', 'Please fill in both password fields')
    return true
  }
<<<<<<< HEAD
  
=======

>>>>>>> c52728d (Add error handling and submission logic for authentication forms)
  if (form.getValues('Newpassword') !== form.getValues('confirmPassword')) {
    toast.error('Password Mismatch', 'Passwords do not match')
    return true
  }
<<<<<<< HEAD
  
=======

>>>>>>> c52728d (Add error handling and submission logic for authentication forms)
  if (errors.Newpassword) {
    toast.error('Invalid Password', 'Password must meet all requirements')
    return true
  }
<<<<<<< HEAD
  return false
}

export const handleGetStartedError = ({ errors, form }: GetStartedErrorHandlerProps) => {
  if (!form.getValues('email')) {
=======

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
>>>>>>> c52728d (Add error handling and submission logic for authentication forms)
>>>>>>> c6737e0 (Add error handling and submission logic for authentication forms)
    toast.error('Required Fields', 'Please fill in all required fields')
    return true
  }

  if (errors.email) {
<<<<<<< HEAD
    toast.error('Invalid Email', 'Enter a valid email address.')
    return true
  }

  if (errors.password) {
    toast.error('Invalid Credentials', 'Please check your email and password')
    return true
  }
  return false
}

export const handleRegisterError = ({ errors, form }: RegisterErrorHandlerProps) => {
  if (!form.getValues('email') || !form.getValues('username') || !form.getValues('password')) {
    toast.error('Required Fields', 'Please fill in all required fields')
    return true
  }
  
  if (errors.email) {
    toast.error('Invalid Email', 'Enter a valid email address.')
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
  
  if (!form.getValues('terms')) {
    toast.error('Terms Required', 'Please accept the Terms & Conditions')
    return true
  }
  return false
}

export const handleResetPasswordError = ({ errors, form }: ResetPasswordErrorHandlerProps) => {
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  if (!form.getValues('Newpassword') || !form.getValues('confirmPassword')) {
    toast.error('Required Fields', 'Please fill in both password fields')
    return true
  }
<<<<<<< HEAD
<<<<<<< HEAD
  
=======

>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
=======
  
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  if (form.getValues('Newpassword') !== form.getValues('confirmPassword')) {
    toast.error('Password Mismatch', 'Passwords do not match')
    return true
  }
<<<<<<< HEAD
<<<<<<< HEAD
  
=======

>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
=======
  
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  if (errors.Newpassword) {
    toast.error('Invalid Password', 'Password must meet all requirements')
    return true
  }
<<<<<<< HEAD
<<<<<<< HEAD
  return false
}

export const handleGetStartedError = ({ errors, form }: GetStartedErrorHandlerProps) => {
  if (!form.getValues('email')) {
=======

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
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
=======
  return false
}

export const handleGetStartedError = ({ errors, form }: GetStartedErrorHandlerProps) => {
  if (!form.getValues('email')) {
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
    toast.error('Required Fields', 'Please fill in all required fields')
    return true
  }

  if (errors.email) {
<<<<<<< HEAD
<<<<<<< HEAD
    toast.error('Invalid Email', 'Enter a valid email address.')
    return true
  }
  
  return false
}

export const handleForgotPasswordError = ({ errors, form }: ForgotPasswordErrorHandlerProps) => {
  if (!form.getValues('email')) {
    toast.error('Required Fields', 'Please fill in the email field')
    return true
  }

  if (errors.email) {
    toast.error('Invalid Email', 'Enter a valid email address.')
=======
    toast.error('Invalid Email', errors.email.message || 'Please enter a valid email address')
<<<<<<< HEAD
=======
    toast.error('Invalid Email', 'Enter a valid email address.')
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
    return true
  }
  
  return false
}

export const handleForgotPasswordError = ({ errors, form }: ForgotPasswordErrorHandlerProps) => {
  if (!form.getValues('email')) {
    toast.error('Required Fields', 'Please fill in the email field')
    return true
  }

  if (errors.email) {
<<<<<<< HEAD
    toast.error('Invalid email', errors.email.message || 'Enter a valid email address.')
    return true
  }
  
  if (errors.username) {
    toast.error('Invalid Username', errors.username.message || 'Username is required.')
    return true
  }
  
  if (errors.password) {
    toast.error('Invalid Password', 'Password must be at least 8 characters, include uppercase, number, and special character')
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
=======
    toast.error('Invalid Email', 'Enter a valid email address.')
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
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
>>>>>>> c6737e0 (Add error handling and submission logic for authentication forms)
    return true
  }

  return false
<<<<<<< HEAD
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
>>>>>>> c52728d (Add error handling and submission logic for authentication forms)
    return true
  }

  return false
<<<<<<< HEAD
}

const handleNetworkError = () => {
  if (!navigator.onLine) {
    toast.error(
      'No Internet Connection',
      'Please check your internet'
    )
    return true
  }
  return false
}

export const handleApiError = (
  error: ApiError,
  type: string, 
  router: AppRouterInstance) => {
  if (!navigator.onLine || (isAxiosError(error) && !error.response)) {
    handleNetworkError()
    return
  }

  switch (type) {
    case 'login': {
      const message = error.message
      switch (message) {
        case 'User not found':
          toast.error('Account Not Found', 'No account exists with this email')
          router.push('/register')
          break
        case 'Invalid password':
          toast.error('Incorrect Password', 'Retry or reset your password.')
          break
        case 'Password not set':
          toast.error('Password Required', 'Please set your password first')
          break
        default:
          toast.error('Login Failed', message || 'Unable to login')
      }
      break
    }

    case 'register': {
      const message = error.message;
      switch (message) {
        case 'Email already exists':
          toast.error('Email already registered', 'Kindly log in or use another email.')
          break
        case 'Validation failed':
          toast.error('Invalid Details', 'Please check your information')
          break
        default:
          toast.error('Registration Failed', message || 'Unable to register')
      }
      break
    }

    case 'reset-password': {
      const message = error.message;
      switch (message) {
        case 'Invalid token':
          toast.error('Invalid Link', 'Reset link is expired or invalid')
          break
        case 'Token expired':
          toast.error('Link Expired', 'Please request a new reset link')
          break
        default:
          toast.error('Reset Failed', message || 'Unable to reset password')
      }
      break
    }

    case 'forgot-password': {
      const message = error.error;      
      switch (message) {
        case 'User not found':
          toast.error('Account Not Found', 'No account with this email')
          router.push('/register')
          break
        case 'Too many requests':
          toast.error('Too Many Attempts', 'Please wait before trying again')
          break
        default:
          toast.error('Request Failed', message || 'Unable to process request')
      }
      break
    }

    default:
        toast.error('Error', error.message)
  }
=======
<<<<<<< HEAD
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
=======
>>>>>>> c52728d (Add error handling and submission logic for authentication forms)
>>>>>>> c6737e0 (Add error handling and submission logic for authentication forms)
}