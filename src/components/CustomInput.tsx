import React from 'react'
import { FormControl, FormField, FormLabel } from '@/components/ui/form'

const CustomInput = ({ form, name, label, placeholder }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel className='text-white text-[14px]'>{label}</FormLabel>
          <div className='flex flex-col w-full mt-2'>
            <FormControl>
              <input className='w-[500px] h-[55px] px-4 py-2 rounded-md 
                  bg-transparent border-2 border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-[#C879EB] 
                  focus:border-[#C879EB] transition-all duration-300
                  text-white placeholder:text-gray-400'
                {...field} />
            </FormControl>
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput
