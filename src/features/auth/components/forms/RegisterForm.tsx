import { Control } from 'react-hook-form'
import CustomInput from '@/components/CustomInput'
import Link from 'next/link'
import PasswordStrengthChecker from '../PasswordStrengthChecker'
import CustomCheckbox from '@/components/ui/CustomCheckbox'
import LabelButton from '@/components/ui/LabelButton'

interface RegisterFormProps {
  control: Control<any>
  isSubmitting: boolean
  password: string
}

export default function RegisterForm({ control, isSubmitting, password }: RegisterFormProps) {
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
        <PasswordStrengthChecker
          password={password ?? ''}
          isFocused={true}
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
    </>
  )
}