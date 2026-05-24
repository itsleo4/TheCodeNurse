import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in Client Components (browser-side).
 * This client uses the browser's context to handle session storage, cookies, and events.
 * 
 * @example
 * ```tsx
 * 'use client'
 * 
 * import { createClient } from '@/lib/supabase/client'
 * import { useEffect, useState } from 'react'
 * 
 * export default function ProjectsList() {
 *   const [projects, setProjects] = useState([])
 *   const supabase = createClient()
 * 
 *   useEffect(() => {
 *     const fetchProjects = async () => {
 *       const { data, error } = await supabase.from('projects').select('*')
 *       if (!error && data) setProjects(data)
 *     }
 *     fetchProjects()
 *   }, [supabase])
 * 
 *   return (
 *     <ul>
 *       {projects.map(project => <li key={project.id}>{project.name}</li>)}
 *     </ul>
 *   )
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
