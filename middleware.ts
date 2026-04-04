import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes — no auth required
const PUBLIC_PREFIXES = ['/', '/sign-in', '/sign-up', '/api/webhooks']

function isPublicRoute(req: NextRequest): boolean {
  const { pathname } = req.nextUrl
  return PUBLIC_PREFIXES.some(
    p => pathname === p || pathname.startsWith(p + '/')
  )
}

export default function middleware(req: NextRequest) {
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Clerk sets __session cookie for authenticated users
  const session = req.cookies.get('__session')?.value

  if (!session) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
