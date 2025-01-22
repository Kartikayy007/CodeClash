import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import Link from 'next/link'
import CustomCheckbox from '@/components/ui/CustomCheckbox'
import LabelButton from '@/components/ui/LabelButton'
import { RegisterFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

type RegisterFormData = z.infer<typeof RegisterFormSchema>

interface RegisterFormProps {
  control: Control<RegisterFormData>
  isSubmitting: boolean
  password: string
}

export default function RegisterForm({ control, isSubmitting }: RegisterFormProps) {
  return (
    <div className='w-full space-y-4 sm:space-y-6'>
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
    </div>
  )
}