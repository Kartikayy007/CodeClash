'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { BackButton } from '@/components/ui/BackButton';
import AuthForm from '@/components/AuthForm';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="flex flex-col items-start justify-center gap-4 sm:gap-6 p-4 sm:p-8 min-w-[320px]">
      <Image
        src='/logo.svg'
        alt="logo"
        width={160}
        height={32}
        className="mx-auto lg:hidden absolute top-[45px] xs:top-[60px] sm:top-[77px] left-1/2 transform -translate-x-1/2"
        priority
      />

      <div className="w-full max-w-md sm:max-w-none">
        <BackButton href="/get-started" />
        
        <div className='space-y-2 mt-4'>
          <h1 className='text-lg sm:text-2xl lg:text-3xl font-bold text-white text-left'>
            Create a New Password
          </h1>

          <p className='text-sm sm:text-base text-white w-full sm:w-96 text-left'>
            Enter a new password to regain access to your account.
          </p>
        </div>
      </div>

      <AuthForm type='reset-password' token={token || ''} />
    </div>
  )
}

export default Page;
