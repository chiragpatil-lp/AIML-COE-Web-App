import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This is a client-side protected route pattern
  // Actual auth checking happens in the AuthContext
  // This middleware just handles basic routing

  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = ['/auth/signin', '/', '/api'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // For protected routes, let the client-side AuthContext handle it
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
