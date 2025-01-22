import { z } from 'zod'
import { Control } from 'react-hook-form'
import { 
  AuthFormSchema, 
  RegisterFormSchema, 
  LoginFormSchema,
  ResetPasswordFormSchema,
  GetStartedFormSchema,
  ForgotPasswordFormSchema 
} from '@/lib/schemas/authSchema'

export type FormDataType = 
  | z.infer<typeof AuthFormSchema>
  | z.infer<typeof RegisterFormSchema>
  | z.infer<typeof LoginFormSchema>
  | z.infer<typeof ResetPasswordFormSchema>
  | z.infer<typeof GetStartedFormSchema>
  | z.infer<typeof ForgotPasswordFormSchema>

export type FormControl = Control<FormDataType>