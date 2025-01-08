import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const authorized = url.searchParams.get('authorized') === 'true';

  if (!authorized) {
    // Construct an absolute URL for redirection
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/payment-success', '/payment-failure'],
};
