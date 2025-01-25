import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
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
    <div className='w-full min-w-[280px] md:w-[450px] space-y-4 sm:space-y-6'>
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
        {/* <PasswordStrengthChecker 
          password={password} 
          isFocused={isFocused}
        /> */}
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
        className="w-full max-w-none"
      >
        Reset Password
      </LabelButton>
    </div>
  )
}