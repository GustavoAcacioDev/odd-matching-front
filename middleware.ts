import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define the paths that require authentication
const protectedPaths = ['/'];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // Ensure your secret matches the NextAuth configuration
  });

  const currentPath = request.nextUrl.pathname;

  // If the token exists, redirect to the home page if trying to access /login
  if (token && currentPath === '/login') {
    const redirectTo = new URL('/', request.url);
    return NextResponse.redirect(redirectTo);
  }

  // If the token doesn't exist and the user is trying to access a protected page, redirect to /login
  if (!token && protectedPaths.includes(currentPath)) {
    const redirectTo = new URL('/login', request.url);
    return NextResponse.redirect(redirectTo);
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Specify the paths to apply the middleware
export const config = {
  matcher: ['/', '/login'], // Adjust this array to include additional paths as needed
};
