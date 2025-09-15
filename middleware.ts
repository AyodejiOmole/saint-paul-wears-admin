import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // skip checks for public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/_next') || pathname.startsWith('/signup')) {
    return NextResponse.next()
  }

  // check for auth cookie
  const loggedIn = req.cookies.get('loggedIn')

  if (!loggedIn || loggedIn.value !== "true") {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// protect specific routes
// export const config = {
//   matcher: ['/banners/:path*', '/orders/:path*', '/products/:path*', '/users/:path*', '/newsletters/:path*', '/delivery-fee/:path*'], // whatever you want protected
// }
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
