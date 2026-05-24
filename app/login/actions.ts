'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type LoginState = {
  error: string | null
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/admin/dashboard'

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    return { error: 'Invalid credentials. Access denied.' }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function secureSignOut() {
  const supabase = createClient()
  
  // 1. Sign out from Supabase (clears server-side session)
  await supabase.auth.signOut()
  
  // 2. Revalidate to ensure all protected routes realize the user is gone
  revalidatePath('/', 'layout')
  
  // 3. Redirect to login page
  redirect('/login')
}
