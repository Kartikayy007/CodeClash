import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import Link from 'next/link'
<<<<<<< HEAD
import CustomCheckbox from '@/components/ui/CustomCheckbox'
import LabelButton from '@/components/ui/LabelButton'
// import { RegisterFormSchema } from '@/lib/schemas/authSchema'
// import { z } from 'zod'
import { FormData } from '@/types/form.types';

// type RegisterFormData = z.infer<typeof RegisterFormSchema>

interface RegisterFormProps {
  control: Control<FormData>;
  isSubmitting: boolean;
  password: string;
}

export default function RegisterForm({ control, isSubmitting }: RegisterFormProps) {
  return (
    <div className='w-full space-y-4 sm:space-y-6'>
=======
import PasswordStrengthChecker from '../PasswordStrengthChecker'
import CustomCheckbox from '@/components/ui/CustomCheckbox'
import LabelButton from '@/components/ui/LabelButton'
<<<<<<< HEAD
<<<<<<< HEAD
import { RegisterFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

type RegisterFormData = z.infer<typeof RegisterFormSchema>

interface RegisterFormProps {
  control: Control<RegisterFormData>
=======

interface RegisterFormProps {
  control: Control<any>
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
import { AuthFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

type RegisterFormData = z.infer<typeof AuthFormSchema>

interface RegisterFormProps {
  control: Control<RegisterFormData>
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)
  isSubmitting: boolean
  password: string
}

export default function RegisterForm({ control, isSubmitting, password }: RegisterFormProps) {
  return (
    <>
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
      <CustomInput
        name="email"
        label="Email"
        control={control}
        placeholder=""
        type="text"
      />
      <CustomInput
        name="username"
        label="Username"
        control={control}
        placeholder=""
        type="text"
      />
      <div className="relative">
        <CustomInput
          name="password"
          label="Password"
          control={control}
          placeholder=""
          type="password"
          showStrengthChecker={true}
        />
<<<<<<< HEAD
=======
        <PasswordStrengthChecker
          password={password ?? ''}
          isFocused={true}
        />
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
      </div>

      <div className='flex items-start sm:items-center gap-2'>
        <CustomCheckbox
          name="terms"
          label=""
          control={control}
        />
        <p className="text-white text-sm sm:text-base">
          I agree to the{' '}
          <Link href={''} className="text-[#C879EB] font-bold hover:opacity-80 transition-opacity">
            Terms and Conditions
          </Link>
          {' '}and{' '}
          <Link href={''} className="text-[#C879EB] font-bold hover:opacity-80 transition-opacity">
            Privacy Policy
          </Link>
        </p>
      </div>

      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
      >
        Sign Up
      </LabelButton>
<<<<<<< HEAD
    </div>
=======
    </>
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
  )
}