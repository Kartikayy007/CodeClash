import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
import Link from 'next/link'
import CustomCheckbox from '@/components/ui/CustomCheckbox'
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)
=======
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
// import { LoginFormSchema } from '@/lib/schemas/authSchema'
// import { z } from 'zod'
import { FormData } from '@/types/form.types';

// type LoginFormData = z.infer<typeof LoginFormSchema>

interface LoginFormProps {
  control: Control<FormData>;
  isSubmitting: boolean;
  password: string;
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { AuthFormSchema } from '@/lib/schemas/authSchema'
=======
import { LoginFormSchema } from '@/lib/schemas/authSchema'
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
import { z } from 'zod'
>>>>>>> 70784f3 (implemented handeling for otp, removed unused import, fixed types)

type LoginFormData = z.infer<typeof LoginFormSchema>

interface LoginFormProps {
  control: Control<LoginFormData>
  isSubmitting: boolean
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
=======
=======
import { AuthFormSchema } from '@/lib/schemas/authSchema'
=======
import { LoginFormSchema } from '@/lib/schemas/authSchema'
>>>>>>> 7e7cc14 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
import { z } from 'zod'
>>>>>>> e488d9d (implemented handeling for otp, removed unused import, fixed types)
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)

type LoginFormData = z.infer<typeof LoginFormSchema>

interface LoginFormProps {
  control: Control<LoginFormData>
  isSubmitting: boolean
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
}

export default function LoginForm({ control, isSubmitting }: LoginFormProps) {
  return (
<<<<<<< HEAD
    <div className='w-full space-y-4 sm:space-y-6'>
=======
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        isLoginForm={true}
=======
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
        isLoginForm={true}
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
        isLoginForm={true}
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
        isLoginForm={true}
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
=======
        isLoginForm={true}
>>>>>>> 7e7cc14 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
      />
      <CustomInput
        name="password"
        label="Password" 
        control={control}
        placeholder=""
        type="password"
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        isLoginForm={true}
=======
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
        isLoginForm={true}
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
        isLoginForm={true}
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
        isLoginForm={true}
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
=======
        isLoginForm={true}
>>>>>>> 7e7cc14 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
      />

      <div className="flex justify-between items-center">
        <Link
          href="/forgot-password"
          className="text-base sm:text-lg text-[#D1D1D1] hover:opacity-80 transition-opacity"
        >
          Forgot Password?
        </Link>
        <div className="flex items-center gap-2">
          <CustomCheckbox
            name="rememberMe"
            label="Remember me"
            control={control}
          />
        </div>
      </div>

      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
      >
        Login
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