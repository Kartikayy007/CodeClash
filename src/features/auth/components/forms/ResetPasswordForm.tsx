import { Control, useWatch } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
import { useState } from 'react'
import PasswordStrengthChecker from '../PasswordStrengthChecker'
import { ResetPasswordFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>

interface ResetPasswordFormProps {
  control: Control<ResetPasswordFormData>
  isSubmitting: boolean
}

export default function ResetPasswordForm({ control, isSubmitting }: ResetPasswordFormProps) {
  const [isFocused, setIsFocused] = useState(false);
  const password = useWatch({
    control,
    name: 'Newpassword',
    defaultValue: ''
  });

  return (
    <div className='w-full space-y-4 sm:space-y-6'>
      <div className="relative">
        <CustomInput
          name="Newpassword"
          label="New Password"
          control={control}
          placeholder=""
          type="password"
          showStrengthChecker={true}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <PasswordStrengthChecker 
          password={password} 
          isFocused={isFocused}
        />
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
    </div>
  )
}