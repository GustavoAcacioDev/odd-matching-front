import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define the paths that require authentication
const protectedPaths = ['/'];

function SessionExpiredRedirect(redirectUrl: URL) {
  const response = NextResponse.redirect(redirectUrl)

  console.log(`Session expired on ${process.env.NODE_ENV} environment`)

  const cookiePrefix = process.env.NODE_ENV === 'production' ? '__Secure-' : ''
  const sessionCookie = cookiePrefix + 'next-auth.session-token'

  console.log('cookiePrefix: ', cookiePrefix)

  response.cookies.set({
    name: sessionCookie,
    value: '',
    expires: new Date(0),
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  })

  console.log('Response after deleting cookie: ', response.cookies.getAll())

  return response
}

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

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
