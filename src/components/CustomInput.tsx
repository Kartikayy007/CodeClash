import React, { useState } from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
// import PasswordStrengthChecker from '../features/auth/components/PasswordStrengthChecker';
import Image from 'next/image';
// import { z } from 'zod'
// import { AuthFormSchema, ForgotPasswordFormSchema, GetStartedFormSchema, LoginFormSchema, RegisterFormSchema, ResetPasswordFormSchema } from '@/lib/schemas/authSchema';
import { FormData } from '@/features/auth/types/form.types';

type FieldNames = 'password' | 'email' | 'username' | 'Newpassword' | 'confirmPassword' | 'terms' | 'rememberMe';

interface CustomInput {
  control: Control<FormData>;
  name: FieldNames;
  label: string;
  placeholder: string;
  type?: string;
  showStrengthChecker?: boolean;
  isLoginForm?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  isLoginForm = false,
}: CustomInput) => {
  const [, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className='form-item'>
          <FormLabel className='text-[#D1D1D1] text-[14px]'>{label}</FormLabel>
          <div className='flex flex-col w-full mt-2'>
            <div className="relative w-full">
              <FormControl>
                <input
                  {...field}
                  value={String(field.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                  className={`w-full 
                    h-[45px] 
                    px-3 sm:px-4
                    py-2
                    rounded-md
                    bg-transparent
                    border-2
                    ${(!isLoginForm && (name === 'Newpassword' || name === 'confirmPassword' || name === 'password') && error) ? 'border-[#EF4444]' : 'border-[#D1D1D1]'}
                    focus:outline-none
                    transition-all
                    duration-500
                    text-sm sm:text-base
                    text-white
                    placeholder:text-gray-400
                    ${type === 'password' ? 'pr-12' : 'pr-4'}`}
                  placeholder={placeholder}
                />
              </FormControl>
              {type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-full transition-colors"
                >
                  <Image
                    src={showPassword ? '/eyeclosed.svg' : '/eye.svg'}
                    alt={showPassword ? 'Hide password' : 'Show password'}
                    width={20}
                    height={20}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button>
              )}
            </div>
            {!isLoginForm && name === 'password' && error && (
              <FormMessage className="text-[#EF4444] text-sm mt-1 ml-1" />
            )}
            {(name === 'Newpassword' || name === 'confirmPassword') && error && (
              <FormMessage className="text-[#EF4444] text-sm mt-1 ml-1" />
            )}
            {/* {showStrengthChecker && (name === 'Newpassword') && (
              <PasswordStrengthChecker
                password={String(field.value || '')}
                isFocused={isFocused}
              />
            )} */}
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;