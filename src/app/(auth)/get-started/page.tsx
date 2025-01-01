import React from 'react'
import LabelButton from '@/components/ui/LabelButton'
import { FcGoogle } from 'react-icons/fc'


const Page = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-6 p-8">
      <h1 className='text-3xl font-bold text-white text-left'>
        Welcome to CodeClash!
      </h1>
      <div className="flex flex-col gap-4">
        <LabelButton variant="filled">
          Get Started
        </LabelButton>
        <div className='flex items-center gap-4 w-full'>
          <div className='flex-1 h-[1px] bg-white'></div>
          <span className='text-white text-base'>or</span>
          <div className='flex-1 h-[1px] bg-white'></div>
        </div>
        <LabelButton variant="outlined">
          <FcGoogle className="inline-block mr-2 text-3xl" />
          Continue with Google
        </LabelButton>
      </div>
    </div>
  )
}

export default Page