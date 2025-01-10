import React, { useState } from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import PasswordStrengthChecker from '../features/auth/components/PasswordStrengthChecker';
import Image from 'next/image';
import { z } from 'zod'
import { AuthFormSchema } from '../lib/utils';

interface CustomInput {
  control: Control<z.infer<typeof AuthFormSchema>>,
  name: keyof z.infer<typeof AuthFormSchema>,
  label: string,
  placeholder: string,
  type?: string;
  showStrengthChecker?: boolean;
}

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  showStrengthChecker
}: CustomInput) => {
  const [isFocused, setIsFocused] = useState(false);
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
                  className={`w-full min-w-[280px]
                    sm:w-[400px] md:w-[450px] lg:w-[500px]
                    h-[45px] sm:h-[55px]
                    px-3 sm:px-4
                    py-2
                    rounded-md
                    bg-transparent
                    border-2
                    ${(name === 'Newpassword' || name === 'confirmPassword' || name == 'password') && error ? 'border-[#EF4444]' : 'border-[#D1D1D1]'}
                    focus:outline-none
                    focus:ring-2
                    ${(name === 'Newpassword' || name === 'confirmPassword' || name == 'password') && error ? 'focus:ring-[#EF4444] focus:border-[#EF4444]' : 'focus:ring-[#C879EB] focus:border-[#C879EB]'}
                    transition-all
                    duration-500
                    text-sm sm:text-base
                    text-white
                    placeholder:text-gray-400
                    pr-10`}
                  placeholder={placeholder}
                />
              </FormControl>
              {type === 'password' && (
                <div className="absolute right-0 top-0 h-full flex items-center pr-3 sm:pr-4">
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center w-6 h-6"
                    >
                    <Image
                      src={showPassword ? '/eyeclosed.svg' : '/eye.svg'}
                      alt={showPassword ? 'Hide password' : 'Show password'}
                      width={20}
                      height={20}
                      className="w-5 h-5 sm:mr-5 md:mr-0"
                    />
                    </button>
                </div>
              )}
            </div>
            {name === 'password'&& error && (
              <FormMessage className="text-[#EF4444] text-sm mt-1 ml-1" />
            )}
            {(name === 'Newpassword' || name === 'confirmPassword') && error && (
              <FormMessage className="text-[#EF4444] text-sm mt-1 ml-1" />
            )}
            {showStrengthChecker && (name === 'Newpassword') && (
              <PasswordStrengthChecker
                password={String(field.value || '')}
                isFocused={isFocused}
              />
            )}
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;