'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { exchangeGoogleToken } from '@/features/auth/thunks/googleAuthThunk';
import Image from 'next/image';
import { AuthApiError } from '@/types/error.types';

const TokenExchange = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tempToken = searchParams.get('token');
    
    const handleTokenExchange = async () => {
      if (!tempToken) {
        setError('Invalid token');
        setTimeout(() => router.push('/login'), 3000);
        return;
      } 

      try {
        const result = await dispatch(exchangeGoogleToken({ tempOAuthToken: tempToken })).unwrap();
        if (result.success && result.data) {
          localStorage.setItem('accessToken', result.data.tokens.accessToken);
          localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
          router.push('/dashboard');
        }
      } catch (error: unknown) {
        console.error('Token exchange error:', error);
        const authError = error as AuthApiError;
        setError(authError.message || 'Authentication failed');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleTokenExchange();
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Image
        src='/logo.svg'
        alt="logo"
        width={160}
        height={32}
        priority
      />
      <div className="mt-8 text-center">
        {error ? (
          <div className="text-red-500 bg-red-100/10 p-4 rounded-lg">
            <p>{error}</p>
            <p className="text-sm mt-2">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white">Authenticating...</p>
          </>
        )}
      </div>
    </div>
  );
};

const OAuthCallback = () => {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      }
    >
      <TokenExchange />
    </Suspense>
  );
};

export default OAuthCallback;