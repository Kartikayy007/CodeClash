<<<<<<< HEAD
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
<<<<<<< HEAD
<<<<<<< HEAD
import { AuthFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

type ResetPasswordFormData = z.infer<typeof AuthFormSchema>
interface ResetPasswordFormProps {
  control: Control<ResetPasswordFormData>
=======
=======
import { AuthFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)

type ResetPasswordFormData = z.infer<typeof AuthFormSchema>
interface ResetPasswordFormProps {
<<<<<<< HEAD
  control: Control<any>
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
  control: Control<ResetPasswordFormData>
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)
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
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
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
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
<<<<<<< HEAD
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
=======
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
>>>>>>> 7e7cc14 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
        <CustomInput
          name="Newpassword"
          label="New Password"
          control={control}
          placeholder=""
          type="password"
          showStrengthChecker={true}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
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
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <PasswordStrengthChecker 
          password={password} 
          isFocused={isFocused}
        />
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
<<<<<<< HEAD
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
=======
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <PasswordStrengthChecker 
          password={password} 
          isFocused={isFocused}
        />
>>>>>>> 7e7cc14 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    </div>
=======
    </>
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
    </div>
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
=======
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
    </div>
=======
    </>
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
<<<<<<< HEAD
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
=======
    </div>
>>>>>>> 7e7cc14 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  )
}