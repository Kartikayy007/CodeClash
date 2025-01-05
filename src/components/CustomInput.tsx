import React from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import PasswordStrengthChecker from './PasswordStrengthChecker';
import Image from 'next/image';

interface CustomInput {
  name: string;
  label: string;
  control: Control<any>;
  placeholder: string;
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
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <div className='form-item'>
          <FormLabel className='text-[#D1D1D1] text-[14px]'>{label}</FormLabel>
          <div className='flex flex-col w-full mt-2'>
            <div className="relative">
              <FormControl>
                <input
                  {...field}
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
                    ${(name === 'Newpassword' || name === 'confirmPassword') && error ? 'border-[#EF4444]' : 'border-[#D1D1D1]'}
                    focus:outline-none
                    focus:ring-2
                    ${(name === 'Newpassword' || name === 'confirmPassword') && error ? 'focus:ring-[#EF4444] focus:border-[#EF4444]' : 'focus:ring-[#C879EB] focus:border-[#C879EB]'}
                    transition-all
                    duration-500
                    text-sm sm:text-base
                    text-white
                    placeholder:text-gray-400`}
                  placeholder={placeholder}
                />
              </FormControl>
              {type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Image
                    src={showPassword ? '/eyeclosed.svg' : '/eye.svg'}
                    alt={showPassword ? 'Hide password' : 'Show password'}
                    width={20}
                    height={20}
                  />
                </button>
              )}
            </div>
            {(name === 'Newpassword' || name === 'confirmPassword') && error && (
              <FormMessage className="text-[#EF4444] text-sm mt-1 ml-1" />
            )}
            {showStrengthChecker && (name === 'Newpassword' || name === 'confirmPassword') && (
              <PasswordStrengthChecker 
                password={field.value}
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