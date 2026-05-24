import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Middleware to handle:
 * 1. Automatic cookie-based session refreshing so the user doesn't get logged out mid-session.
 * 2. Protecting '/admin' routes and redirecting unauthenticated users to '/login'.
 */
export async function middleware(request: NextRequest) {
  // Create an initial response object to set headers on
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Initialize the Supabase client inside the middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          // Sync cookies back to the request so downstream Server Components can read them
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Generate a new response with the updated request headers
          response = NextResponse.next({
            request,
          })
          
          // Sync cookies to the final response headers to save them in the user's browser
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Retrieve the current user. Calling auth.getUser() is essential as it is secure 
  // and validates the session JWT against the Supabase Auth server.
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 1. ROUTE PROTECTION: Secure '/admin' and all its nested paths (e.g. /admin/dashboard)
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // Create a redirection URL to /login
      const loginUrl = new URL('/login', request.url)
      // Optional: Add a redirectTo query parameter so you can send the user back after authenticating
      loginUrl.searchParams.set('redirectTo', pathname)
      
      return NextResponse.redirect(loginUrl)
    }
  }

  // 2. AUTH REDIRECTION: If a logged-in user tries to visit '/login', redirect them to admin dashboard
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images / vector assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
