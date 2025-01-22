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

<<<<<<< HEAD
export type FormData = 
=======
export type FormDataType = 
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  | z.infer<typeof AuthFormSchema>
  | z.infer<typeof RegisterFormSchema>
  | z.infer<typeof LoginFormSchema>
  | z.infer<typeof ResetPasswordFormSchema>
  | z.infer<typeof GetStartedFormSchema>
  | z.infer<typeof ForgotPasswordFormSchema>

<<<<<<< HEAD
export type FormControl = Control<FormData>

export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>
=======
export type FormControl = Control<FormDataType>
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
