import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
<<<<<<< HEAD
import { useState } from 'react'
// import PasswordStrengthChecker from '../PasswordStrengthChecker'
// import { ResetPasswordFormData } from '@/types/form.types'
import { FormData } from '@/types/form.types'

interface ResetPasswordFormProps {
  control: Control<FormData>
  isSubmitting: boolean
}

export default function ResetPasswordForm({ control, isSubmitting }: ResetPasswordFormProps) {
  const [, setIsFocused] = useState(false);

  return (
    <div className='w-full space-y-4 sm:space-y-6'>
      <div className="relative">
=======
import PasswordStrengthChecker from '../PasswordStrengthChecker'
import { AuthFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

type ResetPasswordFormData = z.infer<typeof AuthFormSchema>
interface ResetPasswordFormProps {
  control: Control<ResetPasswordFormData>
  isSubmitting: boolean
  newPassword: string
}

export default function ResetPasswordForm({ control, isSubmitting, newPassword }: ResetPasswordFormProps) {
  return (
    <>
      <div className="relative">
        <div className='hidden'>
          <CustomInput
            name="email"
            label="Email"
            control={control}
            placeholder=""
            type="text"
          />
        </div>
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
        <CustomInput
          name="Newpassword"
          label="New Password"
          control={control}
          placeholder=""
          type="password"
          showStrengthChecker={true}
<<<<<<< HEAD
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {/* <PasswordStrengthChecker 
          password={password} 
          isFocused={isFocused}
        /> */}
=======
        />
        <PasswordStrengthChecker
          password={newPassword ?? ''}
          isFocused={true}
        />
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
      </div>
      <div className="relative">
        <CustomInput
          name="confirmPassword"
          label="Confirm Password"
          control={control}
          placeholder=""
          type="password"
        />
      </div>
      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
      >
        Reset Password
      </LabelButton>
<<<<<<< HEAD
    </div>
=======
    </>
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
  )
}