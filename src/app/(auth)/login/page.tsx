import React from 'react'
import Image from 'next/image'
import { BackButton } from '@/components/ui/BackButton'
import AuthForm from '@/components/AuthForm'

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

      <BackButton href="/get-started" />

      <h1 className='lg:text-3xl text-2xl font-bold text-white text-left'>
        Login
      </h1>

      <AuthForm type='login' />


    </div>
  )
}

export default Page