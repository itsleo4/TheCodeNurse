'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type LoginState = {
  error: string | null
}

/**
 * Server Action: handles admin login via Supabase Auth.
 *
 * Flow:
 * 1. Reads email + password from the submitted form.
 * 2. Calls supabase.auth.signInWithPassword() — Supabase validates credentials.
 * 3. On success, Supabase returns a session; @supabase/ssr writes it to cookies automatically.
 * 4. Redirects the user to /admin (or the redirectTo path set by middleware).
 */
export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/admin'

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  const safeRedirect =
    redirectTo.startsWith('/admin') ? redirectTo : '/admin'

  redirect(safeRedirect)
}
