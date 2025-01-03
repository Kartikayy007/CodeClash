import React from 'react'
import { FormControl, FormField, FormLabel } from '@/components/ui/form'

import { Control } from 'react-hook-form'
import { z } from 'zod'
import { AuthFormSchema } from '../lib/utils';

interface CustomInput {
  control: Control<z.infer<typeof AuthFormSchema>>,
  name: keyof z.infer<typeof AuthFormSchema>,
  label: 'Email' | 'Password' | 'New Password' | 'Confirm Password',
  placeholder: string,
}

const CustomInput = ({ control, name, label, placeholder } : CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel className='text-[#D1D1D1] text-[14px]'>{label}</FormLabel>
          <div className='flex flex-col w-full mt-2'>
            <FormControl>
              <input className='w-full sm:w-[400px] md:w-[450px] lg:w-[500px] h-[55px] px-4 py-2 rounded-md 
                  bg-transparent border-2 border-[#D1D1D1]
                  focus:outline-none focus:ring-2 focus:ring-[#C879EB] 
                  focus:border-[#C879EB] transition-all duration-300
                  text-white placeholder:text-gray-400'
                type={name} 
                placeholder={placeholder}
                {...field} />
            </FormControl>
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput