import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
import Link from 'next/link'
import CustomCheckbox from '@/components/ui/CustomCheckbox'
// import { LoginFormSchema } from '@/lib/schemas/authSchema'
// import { z } from 'zod'
import { FormData } from '@/types/form.types';

// type LoginFormData = z.infer<typeof LoginFormSchema>

interface LoginFormProps {
  control: Control<FormData>;
  isSubmitting: boolean;
  password: string;
}

export default function LoginForm({ control, isSubmitting }: LoginFormProps) {
  return (
    <div className='w-full min-w-[280px] md:w-[450px] space-y-4 sm:space-y-6'>
      <CustomInput
        name="email" 
        label="Email"
        control={control}
        placeholder=""
        type="text"
        isLoginForm={true}
      />
      <CustomInput
        name="password"
        label="Password" 
        control={control}
        placeholder=""
        type="password"
        isLoginForm={true}
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
        className="w-full max-w-none"
      >
        Login
      </LabelButton>
    </div>
  )
}