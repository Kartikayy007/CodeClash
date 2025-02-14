import { z } from 'zod'
import { Control } from 'react-hook-form'
import { 
  AuthFormSchema, 
  RegisterFormSchema, 
  LoginFormSchema,
  ResetPasswordFormSchema,
  GetStartedFormSchema,
  ForgotPasswordFormSchema,
  SettingsPasswordFormSchema,
  SettingsUsernameFormSchema
} from '@/lib/schemas/authSchema'

export type FormData = 
  | z.infer<typeof AuthFormSchema>
  | z.infer<typeof RegisterFormSchema>
  | z.infer<typeof LoginFormSchema>
  | z.infer<typeof ResetPasswordFormSchema>
  | z.infer<typeof GetStartedFormSchema>
  | z.infer<typeof ForgotPasswordFormSchema>
  | z.infer<typeof SettingsPasswordFormSchema>
  | z.infer<typeof SettingsUsernameFormSchema>

export type FormControl = Control<FormData>

export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>
export type SettingsPasswordFormData = z.infer<typeof SettingsPasswordFormSchema>
export type SettingsUsernameFormData = z.infer<typeof SettingsUsernameFormSchema>