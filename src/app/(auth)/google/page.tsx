'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { exchangeGoogleToken } from '@/features/auth/thunks/googleAuthThunk';
import Image from 'next/image';
import { toast } from '@/providers/toast-config';

const Page = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    const handleTokenExchange = async () => {

      if (!token) {
        setError('Authentication Failed');
        return;
      }

      try {
        const result = await dispatch(exchangeGoogleToken({ 
          tempOAuthToken: token 
        })).unwrap();
        console.log(result);
        if (result.success && result.data?.tokens) {
          localStorage.setItem('accessToken', result.data.tokens.accessToken);
          localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
          
          document.cookie = `accessToken=${result.data.tokens.accessToken}; path=/`;
          document.cookie = `refreshToken=${result.data.tokens.refreshToken}; path=/`;

          console.log('Login successful:', result);

          toast.success('Login Successful', 'Welcome back!');
          router.replace('/dashboard'); 
        }
      } catch (error) {
        toast.error('Authentication Failed', 'Please try again');
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
      <div className="mt-8 text-center">
        {error ? (
          <p className="text-red-500">{error}</p>
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

export default Page;