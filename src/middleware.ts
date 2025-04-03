import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Special key for contest creation access
const CONTEST_CREATE_KEY = "sdc"; // Replace with your actual secret key

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken");
  const isRegistering = request.cookies.get("isRegistering");
  const registrationEmail = request.cookies.get("registrationEmail");

  // Check if the path starts with /battle
  if ((pathname.startsWith("/battle"))||(pathname.startsWith("/dashboard"))||(pathname.startsWith("/profile"))) {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  // Check contest/create route access
  if (pathname.startsWith("/contest/create")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/get-started", request.url));
    }

    // Check for special key in query parameters
    const createKey = request.nextUrl.searchParams.get("key");
    
    // If no key provided or key doesn't match, redirect to 404
    if (!createKey || createKey !== CONTEST_CREATE_KEY) {
      return NextResponse.redirect(new URL("/404", request.url));
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
      return NextResponse.redirect(new URL("/contest/join", request.url));
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
