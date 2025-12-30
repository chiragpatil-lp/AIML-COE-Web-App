import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware for route protection and authentication
 *
 * NOTE: Firebase Admin SDK cannot be used in Edge Runtime (where middleware runs).
 * For production, consider one of these approaches:
 * 1. Use Firebase Auth REST API to verify tokens
 * 2. Implement session cookies with server-side verification
 * 3. Use a different auth solution compatible with Edge Runtime
 *
 * Current implementation provides basic client-side auth with server-side validation
 * of token presence. Full token verification happens in API routes.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Helper to determine the correct base URL, prioritizing X-Forwarded headers
  const getBaseUrl = () => {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto");
    if (forwardedHost) {
      return `${forwardedProto || "https"}://${forwardedHost}`;
    }
    return request.nextUrl.origin;
  };

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/signin", "/", "/api"];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for authentication token
  // Get token from cookie or Authorization header
  const token = request.cookies.get("firebase-token")?.value;
  const authHeader = request.headers.get("Authorization");
  const hasAuthToken = token || authHeader?.startsWith("Bearer ");

  if (!hasAuthToken) {
    // No token found, redirect to sign-in
    const baseUrl = getBaseUrl();
    const signInUrl = new URL("/auth/signin", baseUrl);
    signInUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Token exists, allow the request to proceed
  // Full token verification will happen in API routes using Firebase Admin SDK
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
