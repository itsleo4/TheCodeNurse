import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for Server-Side contexts in Next.js (Server Components, Server Actions, Route Handlers).
 * It automatically reads and writes cookies to maintain the user's session state.
 * 
 * @example
 * ```tsx
 * // In a Server Component (app/projects/page.tsx)
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function ProjectsPage() {
 *   const supabase = createClient()
 *   const { data: projects } = await supabase.from('projects').select('*')
 *   
 *   return (
 *     <div>
 *       <h1>Projects</h1>
 *       {projects?.map(p => <p key={p.id}>{p.title}</p>)}
 *     </div>
 *   )
 * }
 * ```
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}

/**
 * A secure server-side utility function to retrieve the current authenticated user's details.
 * Unlike getSession(), this function securely verifies the JWT signature on the Supabase Auth server.
 * 
 * @returns The authenticated user object, or null if the user is not logged in.
 * 
 * @example
 * ```ts
 * // In a Server Action (app/actions.ts)
 * 'use server'
 * 
 * import { getAuthUser, createClient } from '@/lib/supabase/server'
 * 
 * export async function createProject(formData: FormData) {
 *   const user = await getAuthUser()
 *   if (!user) throw new Error("Unauthorized")
 *   
 *   const supabase = createClient()
 *   const title = formData.get('title') as string
 *   
 *   const { data, error } = await supabase
 *     .from('projects')
 *     .insert({ title, user_id: user.id })
 *     
 *   return data
 * }
 * ```
 */
export async function getAuthUser() {
  const supabase = createClient()
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return null
    }
    return user
  } catch (error) {
    console.error('getAuthUser Error:', error)
    return null
  }
}

/**
 * Optional helper to fetch the current user's profile from the 'profiles' table.
 * Assumes a `profiles` table exists where the primary key `id` corresponds to the auth user ID.
 * 
 * @returns The user profile record, or null if not found/unauthenticated.
 */
export async function getAuthUserProfile() {
  const user = await getAuthUser()
  if (!user) return null

  const supabase = createClient()
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('getAuthUserProfile Error:', error)
      return null
    }
    return profile
  } catch (error) {
    console.error('getAuthUserProfile Exception:', error)
    return null
  }
}
