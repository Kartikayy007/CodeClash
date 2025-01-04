import AuthForm from '@/components/AuthForm'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-6 p-8">
      <h1 className='lg:text-3xl text-2xl font-bold text-white text-left'>
        Verify OTP
      </h1>
      <AuthForm type='verify' />
    </div>
  )
}

export default page
