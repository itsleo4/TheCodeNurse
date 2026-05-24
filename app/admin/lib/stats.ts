import { createClient } from '@/lib/supabase/server'

export type DashboardStats = {
  totalProjects: number
  totalMessages: number
  unreadMessages: number
}

export type RecentMessage = {
  id: string
  visitor_name: string
  visitor_email: string | null
  visitor_phone: string | null
  message_body: string
  is_read: boolean
  created_at: string
}

const defaultStats: DashboardStats = {
  totalProjects: 0,
  totalMessages: 0,
  unreadMessages: 0,
}

/**
 * Fetches aggregate counts for the admin dashboard stat cards.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()

  try {
    const [projectsResult, messagesResult, unreadResult] = await Promise.all([
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false),
    ])

    if (projectsResult.error) {
      console.error('getDashboardStats projects error:', projectsResult.error)
    }
    if (messagesResult.error) {
      console.error('getDashboardStats messages error:', messagesResult.error)
    }
    if (unreadResult.error) {
      console.error('getDashboardStats unread error:', unreadResult.error)
    }

    return {
      totalProjects: projectsResult.count ?? 0,
      totalMessages: messagesResult.count ?? 0,
      unreadMessages: unreadResult.count ?? 0,
    }
  } catch (error) {
    console.error('getDashboardStats exception:', error)
    return defaultStats
  }
}

/**
 * Fetches the 5 most recent inbox messages for the dashboard list.
 */
export async function getRecentMessages(): Promise<RecentMessage[]> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('messages')
      .select(
        'id, visitor_name, visitor_email, visitor_phone, message_body, is_read, created_at'
      )
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('getRecentMessages error:', error)
      return []
    }

    return data ?? []
  } catch (error) {
    console.error('getRecentMessages exception:', error)
    return []
  }
}
