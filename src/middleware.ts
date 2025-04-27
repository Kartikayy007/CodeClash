import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Special key for contest creation access

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken");
  const isRegistering = request.cookies.get("isRegistering");
  const registrationEmail = request.cookies.get("registrationEmail");

  // Check if the path starts with /battle
  // if ((pathname.startsWith("/battle"))||(pathname.startsWith("/profile"))) {
  //   return NextResponse.redirect(new URL("/404", request.url));
  // }

  // Check contest/create route access
  if (pathname.startsWith("/contest/create")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/get-started", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/verify") {
    if (!isRegistering || !registrationEmail) {
      return NextResponse.redirect(new URL("/register", request.url));
    }
    return NextResponse.next();
  }

  const protectedRoutes = [
    "/dashboard",
    "/settings",
    "/profile",
    "/contest/join",
  ];
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/get-started", request.url));
    }
    return NextResponse.next();
  }

  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/get-started",
  ];
  if (publicRoutes.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/battle/:path*",
    "/verify",
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/get-started",
    "/contest/create",
  ],
};

// Middleware to redirect to dashboard if user is not logged in