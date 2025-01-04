import React from 'react'
import { FormControl, FormField, FormLabel } from '@/components/ui/form'

import { Control } from 'react-hook-form'
import { z } from 'zod'
import { AuthFormSchema } from '../lib/utils';

interface CustomInput {
  control: Control<z.infer<typeof AuthFormSchema>>,
  name: keyof z.infer<typeof AuthFormSchema>,
  label: string,
  placeholder: string,
  type?: 'email' | 'password' | 'text'
}

const CustomInput = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  type = 'text' 
}: CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel className='text-[#D1D1D1] text-[14px]'>{label}</FormLabel>
          <div className='flex flex-col w-full mt-2'>
            <FormControl>
              <input 
                className='w-full min-w-[280px]
                  sm:w-[400px] md:w-[450px] lg:w-[500px] 
                  h-[45px] sm:h-[55px] 
                  px-3 sm:px-4 
                  py-2 
                  rounded-md 
                  bg-transparent 
                  border-2 
                  border-[#D1D1D1]
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-[#C879EB] 
                  focus:border-[#C879EB] 
                  transition-all 
                  duration-300
                  text-sm sm:text-base
                  text-white 
                  placeholder:text-gray-400'
                type={type}
                placeholder={placeholder}
                {...field} 
              />
            </FormControl>
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput