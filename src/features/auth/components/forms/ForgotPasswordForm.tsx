import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'

interface ForgotPasswordFormProps {
  control: Control<any>
  isSubmitting: boolean
  resetLinkSent: boolean
  timeLeft: number
  onResendClick?: () => void
}

export default function ForgotPasswordForm({ 
  control, 
  isSubmitting, 
  resetLinkSent,
  timeLeft,
  onResendClick 
}: ForgotPasswordFormProps) {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className='text-center'>
      </div>
      {!resetLinkSent ? (
        <CustomInput
          name="email"
          label="Email"
          control={control}
          placeholder=""
          type="text"
        />
      ) : (
        <span className="text-[#E7E7E7]">
          You can request a resend after {timeLeft}s
        </span>
      )}
      <LabelButton
        type='submit'
        variant="filled"
        disabled={isSubmitting || timeLeft > 0}
        onClick={resetLinkSent ? onResendClick : undefined}
      >
        {resetLinkSent ? 'Resend Link' : 'Send Reset Link'}
      </LabelButton>
    </div>
  )
}