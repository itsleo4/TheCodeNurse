import { LoginForm } from './login-form'

type LoginPageProps = {
  searchParams: { redirectTo?: string }
}

/**
 * Admin Login Page (Server Component)
 *
 * Reads the optional `redirectTo` query param set by middleware when an
 * unauthenticated user tries to access /admin, then passes it to the client form.
 */
export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo =
    searchParams.redirectTo?.startsWith('/admin')
      ? searchParams.redirectTo
      : '/admin'

  return <LoginForm redirectTo={redirectTo} />
}
