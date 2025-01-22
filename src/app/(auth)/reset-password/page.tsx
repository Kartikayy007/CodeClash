'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { BackButton } from '@/components/ui/BackButton';
import AuthForm from '@/features/auth/components/AuthForm';
import { useRouter, useSearchParams } from 'next/navigation';

const TokenHandler = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || null;
  const router = useRouter();

  React.useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="flex flex-col items-start justify-center gap-4 sm:gap-6 sm:p-8 min-w-[320px]">
      <Image
        src='/logo.svg'
        alt="logo"
        width={160}
        height={32}
        className="mx-auto lg:hidden absolute top-[60px] left-1/2 transform -translate-x-1/2"
        priority
      />

      <div className="w-full max-w-md sm:max-w-none">
        <BackButton href="/get-started" />
        <div className='space-y-2 mt-4'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-white text-left'>
            Create a New Password
          </h1>
          <p className='text-sm sm:text-base text-white text-left'>
            Enter a new password to regain access to your account.
          </p>
        </div>
      </div>

      <AuthForm type='reset-password' token={token || ''} />
    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <Image
      src='/logo.svg'
      alt="logo"
      width={160}
      height={32}
      priority
    />
    <div className="mt-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
    </div>
  </div>
);

const Page = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <TokenHandler />
    </Suspense>
  );
};

export default Page;