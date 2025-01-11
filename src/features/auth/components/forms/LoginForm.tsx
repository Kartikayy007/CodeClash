import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
import Link from 'next/link'
import CustomCheckbox from '@/components/ui/CustomCheckbox'
import { AuthFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

type LoginFormData = z.infer<typeof AuthFormSchema>
interface LoginFormProps {
  control: Control<LoginFormData>
  isSubmitting: boolean
}

export default function LoginForm({ control, isSubmitting }: LoginFormProps) {
  return (
    <>
      <CustomInput
        name="email" 
        label="Email"
        control={control}
        placeholder=""
        type="text"
      />
      <CustomInput
        name="password"
        label="Password" 
        control={control}
        placeholder=""
        type="password"
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
    </>
  )
}