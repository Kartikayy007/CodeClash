import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
// import { ForgotPasswordFormSchema } from '@/lib/schemas/authSchema'
// import { z } from 'zod'
import { FormData } from '@/features/auth/types/form.types'


// type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>;

interface ForgotPasswordFormProps {
  control: Control<FormData>;
  isSubmitting: boolean;
  resetLinkSent: boolean;
  timeLeft: number;
  onResendClick?: () => void;
}

export default function ForgotPasswordForm({ 
  control, 
  isSubmitting, 
  resetLinkSent,
  timeLeft
}: ForgotPasswordFormProps) {
  return (
    <div className="w-full min-w-[280px] md:w-[450px] space-y-4 sm:space-y-6">
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
        disabled={isSubmitting}
        className="w-full max-w-none"
      >
        {resetLinkSent ? 'Resend Link' : 'Send Reset Link'}
      </LabelButton>
    </div>
  );
}