'use client';

import React, { useState } from 'react';
import LabelButton from '@/components/ui/LabelButton';
import { FcGoogle } from 'react-icons/fc';
import AuthForm from '@/features/auth/components/AuthForm';
import Image from 'next/image';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
  };

  return (
    <div className="flex flex-col items-start justify-center gap-4 sm:gap-6 p-4 sm:p-8 w-full min-w-[280px] sm:min-w-[400px] md:w-[550px] lg:w-[600px]">
      <Image
        src='/logo.svg'
        alt="logo"
        width={160}
        height={32}
        className="mx-auto lg:hidden absolute top-[60px] left-1/2 transform -translate-x-1/2"
        priority
      />

      <div className="w-full">
        <h1 className='text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white text-left mt-2'>
          Welcome to CodeClash!
        </h1>
      </div>

      <AuthForm type='get-started' />

      <div className="flex flex-col gap-4 w-full">
        <div className='flex items-center gap-2 sm:gap-4 w-full'>
          <div className='flex-1 h-[1px] bg-white'></div>
          <span className='text-sm sm:text-base text-white whitespace-nowrap'>or</span>
          <div className='flex-1 h-[1px] bg-white'></div>
        </div>

        <LabelButton 
          variant="outlined" 
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle className="inline-block mr-2 text-2xl sm:text-3xl" />
          <span className="text-sm sm:text-base">
            Continue with Google
          </span>
        </LabelButton>
      </div>
    </div>
  );
};

export default Page;