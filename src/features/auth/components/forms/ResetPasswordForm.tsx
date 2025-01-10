import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
import PasswordStrengthChecker from '../PasswordStrengthChecker'

interface ResetPasswordFormProps {
  control: Control<any>
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
        <CustomInput
          name="Newpassword"
          label="New Password"
          control={control}
          placeholder=""
          type="password"
          showStrengthChecker={true}
        />
        <PasswordStrengthChecker
          password={newPassword ?? ''}
          isFocused={true}
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
    </>
  )
}