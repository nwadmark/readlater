import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OWNER_KEY_COOKIE = 'readlater_owner_key';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10; // 10 years

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if ownerKey cookie exists
  const existingOwnerKey = request.cookies.get(OWNER_KEY_COOKIE);

  if (!existingOwnerKey) {
    // Generate new UUID using Web Crypto API (Edge Runtime compatible)
    const newOwnerKey = crypto.randomUUID();
    response.cookies.set(OWNER_KEY_COOKIE, newOwnerKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
