import React from 'react'
import Image from 'next/image'
import { BackButton } from '@/components/ui/BackButton'
import AuthForm from '@/features/auth/components/AuthForm'

const Page = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-4 sm:gap-6  sm:p-8 min-w-[320px]">

      <Image
        src='/logo.svg'
        alt="logo"
        width={160}
        height={32}
        className="mx-auto lg:hidden absolute top-[60px] left-1/2 transform -translate-x-1/2"
        priority
      />

      <div className="w-full">
        <BackButton href="/get-started" />
        <h1 className='text-lg sm:text-xl lg:text-3xl font-bold text-white text-left mt-2'>
          Login
        </h1>
      </div>

      <AuthForm type='login' />
    </div>
  )
}

export default Page