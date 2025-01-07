import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessToken');

  const protectedRoutes = ['/dashboard', '/settings', '/profile'];
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname === '/verify') {
    const isRegistering = request.cookies.get('isRegistering');
    if (!isRegistering) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }

  const publicRoutes = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/get-started',
    '/google',
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
    '/google'
  ],
};