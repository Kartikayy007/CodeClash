import * as React from 'react'
import { Control } from 'react-hook-form';

interface CustomCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  control: Control<any>;
}

const CustomCheckbox = ({ label, ...props }: CustomCheckboxProps) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="peer hidden"
          {...props}
        />
        <div className="h-5 w-5 border-2 border-[#D1D1D1] bg-[#D1D1D1] rounded-sm 
          peer-checked:bg-[#D1D1D1] peer-checked:border-[#D1D1D1]
          transition-all duration-200 ease-in-out
          hover:border-[#D1D1D1]/80
          peer-focus:ring-2 peer-focus:ring-[#D1D1D1]/20"
        />
        <svg
          className="absolute top-[2px] left-[2px] h-4 w-4
            pointer-events-none opacity-0 peer-checked:opacity-100
            transition-opacity duration-200 ease-in-out"
          fill="none"
          viewBox="0 0 24 24"
          stroke="black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      {label && <span className="text-white text-sm">{label}</span>}
    </label>
  )
}

export default CustomCheckbox