'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminRouteProps } from '@/types/admin.types';

interface AdminProtectedRouteProps extends AdminRouteProps {
  fallbackUrl?: string;
  loadingComponent?: React.ReactNode;
  adminKey?: string;
}

export default function AdminProtectedRoute({
  children,
  fallbackUrl = '/dashboard',
  loadingComponent = <div className="flex items-center justify-center min-h-screen">Loading...</div>,
  adminKey = 'jellybean'
}: AdminProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        // Check if the correct admin key is provided in query params
        const providedKey = searchParams.get('key');
        
        if (providedKey === adminKey) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [searchParams, adminKey]);

  useEffect(() => {
    if (isAuthorized === false) {
      router.push(fallbackUrl);
    }
  }, [isAuthorized, router, fallbackUrl]);

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (isAuthorized === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500">Please contact an administrator for access.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component version
export function withAdminProtection<P extends object>(
  Component: React.ComponentType<P>,
  adminKey?: string
) {
  return function AdminProtectedComponent(props: P) {
    return (
      <AdminProtectedRoute adminKey={adminKey}>
        <Component {...props} />
      </AdminProtectedRoute>
    );
  };
}
