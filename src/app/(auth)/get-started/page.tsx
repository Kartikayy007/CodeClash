import React from 'react'
import LabelButton from '@/components/ui/LabelButton'
import { FcGoogle } from 'react-icons/fc'
import AuthForm from '@/components/AuthForm'
import Image from 'next/image'


const Page = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-6 p-8">
      <Image
        src='/logo.svg'
        alt="logo"
        width={200}
        height={40}
        className="mx-auto lg:hidden absolute top-[77px] left-1/2 transform -translate-x-1/2"
        priority
      />
  
      <h1 className='lg:text-3xl text-2xl font-bold text-white text-left'>
        Welcome to CodeClash!
      </h1>

      <AuthForm type='get-started' />

      <div className="flex flex-col gap-4">
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