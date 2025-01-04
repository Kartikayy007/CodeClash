import React from 'react'
import Image from 'next/image'
import { BackButton } from '@/components/ui/BackButton'
import CustomOtp from '@/components/CustomOtp'

const page = () => {
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


      <div className="w-full max-w-md sm:max-w-none">
        <BackButton href="/get-started" />

        <div className='space-y-2 mt-4'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-white text-left'>
            Verify Your Email
          </h1>

          <p className='text-sm sm:text-base text-white text-left'>
            We've sent a 4-digit verification code to xxx@gmail.com
          </p>
        </div>
      </div>

      <div className='w-full max-w-md mt-4 sm:mt-8'>
        <CustomOtp />
      </div>

    </div>
  )
}

export default page
