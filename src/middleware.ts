import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessToken');
  const isRegistering = request.cookies.get('isRegistering');
  const registrationEmail = request.cookies.get('registrationEmail');

  if (pathname === '/verify') {
    if (!isRegistering || !registrationEmail) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
    return NextResponse.next();
  }

  const protectedRoutes = ['/dashboard', '/settings', '/profile'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const publicRoutes = ['/login', '/register', '/forgot-password', '/get-started'];
  if (publicRoutes.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
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
    '/get-started'
  ],
};