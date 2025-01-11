import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)
// import { ForgotPasswordFormSchema } from '@/lib/schemas/authSchema'
// import { z } from 'zod'
import { FormData } from '@/types/form.types'


// type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>;

interface ForgotPasswordFormProps {
  control: Control<FormData>;
  isSubmitting: boolean;
  resetLinkSent: boolean;
  timeLeft: number;
  onResendClick?: () => void;
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { AuthFormSchema } from '@/lib/schemas/authSchema'
=======
import { ForgotPasswordFormSchema } from '@/lib/schemas/authSchema'
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
import { z } from 'zod'
>>>>>>> 70784f3 (implemented handeling for otp, removed unused import, fixed types)


type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>;

interface ForgotPasswordFormProps {
<<<<<<< HEAD
  control: Control<ForgotPasswordFormData>
=======
=======
=======
import { AuthFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'
>>>>>>> e488d9d (implemented handeling for otp, removed unused import, fixed types)
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)

type ForgotPasswordFormData = z.infer<typeof AuthFormSchema>
interface ForgotPasswordFormProps {
<<<<<<< HEAD
  control: Control<any>
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
  control: Control<ForgotPasswordFormData>
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)
  isSubmitting: boolean
  resetLinkSent: boolean
  timeLeft: number
  onResendClick?: () => void
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
  control: Control<ForgotPasswordFormData>;
  isSubmitting: boolean;
  resetLinkSent: boolean;
  timeLeft: number;
  onResendClick?: () => void;
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
}

export default function ForgotPasswordForm({ 
  control, 
  isSubmitting, 
  resetLinkSent,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
  timeLeft
=======
  timeLeft,
  onResendClick 
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
  timeLeft
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
        disabled={isSubmitting}
=======
        disabled={isSubmitting || timeLeft > 0}
        onClick={resetLinkSent ? onResendClick : undefined}
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
        disabled={isSubmitting}
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
      >
        {resetLinkSent ? 'Resend Link' : 'Send Reset Link'}
      </LabelButton>
    </div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
  );
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
  );
=======
  )
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
}