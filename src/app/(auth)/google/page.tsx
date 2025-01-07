'use client';

import { Suspense } from 'react';
import TokenExchange from '@/components/TokenExchange';
import Image from 'next/image';

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <Image
      src='/logo.svg'
      alt="logo"
      width={160}
      height={32}
      priority
    />
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mt-8" />
  </div>
);

const Page = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TokenExchange />
    </Suspense>
  );
};

export default Page;