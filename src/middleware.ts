import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessToken');

  // Verify page protection
  if (pathname === '/verify') {
    const isRegistering = request.cookies.get('isRegistering');
    const registrationEmail = request.cookies.get('registrationEmail');
    
    if (!isRegistering || !registrationEmail) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
    return NextResponse.next();
  }

  // Public routes
  const publicRoutes = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/get-started',
    '/oauth',
    '/reset-password'
  ];

  if (publicRoutes.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/verify',
    '/dashboard/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/get-started',
    '/oauth'
  ],
};