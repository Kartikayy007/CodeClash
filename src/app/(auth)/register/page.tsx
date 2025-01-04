import React from 'react'
import Image from 'next/image'
import { BackButton } from '@/components/ui/BackButton'
import AuthForm from '@/components/AuthForm'

const page = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-4 sm:gap-6 p-4 sm:p-8 min-w-[320px]">
      <Image
              src='/logo.svg'
              alt="logo"
              width={200}
              height={40}
              className="mx-auto lg:hidden absolute top-8 sm:top-[77px] left-1/2 transform -translate-x-1/2" 
              priority
            />

      <div className="w-full">
        <BackButton href="/get-started" />
        <h1 className='text-lg sm:text-xl lg:text-3xl font-bold text-white text-left mt-2'>
          Create an account
        </h1>
      </div>

      <AuthForm type='register' />
    </div>
  )
}

export default page
