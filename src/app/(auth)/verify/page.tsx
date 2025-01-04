import React from 'react'
import CustomOtp from '@/components/CustomOtp'

const page = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-6 p-8">
      <h1 className='lg:text-3xl text-2xl font-bold text-white text-left'>
        Verify OTP
      </h1>

      <p className='text-white text-base'>
        Enter the OTP sent to your email address
      </p>

      <CustomOtp />

    </div>
  )
}

export default page
