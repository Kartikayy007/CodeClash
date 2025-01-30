'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { exchangeGoogleToken } from '@/features/auth/thunks/googleAuthThunk';
import { toast } from '@/providers/toast-config';
import { AuthApiError } from '@/features/auth/types/error.types';
import Image from 'next/image';

const TokenExchange = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams?.get('token') || null;
    
    const handleTokenExchange = async () => {
      if (!token) {
        toast.error('Invalid Token', 'Authentication failed');
        router.replace('/login');
        return;
      }

      try {
        const result = await dispatch(exchangeGoogleToken({ 
          tempOAuthToken: token 
        })).unwrap();
        
        if (result.success && result.data?.tokens) {
          localStorage.setItem('accessToken', result.data.tokens.accessToken);
          localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
          
          document.cookie = `accessToken=${result.data.tokens.accessToken}; path=/`;
          document.cookie = `refreshToken=${result.data.tokens.refreshToken}; path=/`;

          toast.success('Login Successful', 'Welcome back!');
          router.replace('/dashboard');
        }
      } catch (error: unknown) {
        const authError = error as AuthApiError;
        toast.error(
          'Authentication Failed', 
          authError.message || 'Please try again'
        );
        router.replace('/login');
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mt-8" />
    </div>
  );
};

export default TokenExchange;