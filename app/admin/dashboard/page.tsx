import Link from 'next/link'
import { FolderKanban, Mail, MailOpen, Clock } from 'lucide-react'
import {
  getDashboardStats,
  getRecentMessages,
  type RecentMessage,
} from '@/app/admin/lib/stats'

type StatCardProps = {
  title: string
  value: number
  icon: React.ReactNode
  color?: 'blue' | 'emerald' | 'amber'
}

function StatCard({ title, value, icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-[#0056b3]',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-3 text-4xl font-bold text-[#1a2b4a]">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${colorClasses[color]} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function formatMessageDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function getMessagePreview(body: string): string {
  if (body.length <= 60) return body
  return `${body.slice(0, 60)}...`
}

function getContactLine(message: RecentMessage): string {
  const parts = [message.visitor_email, message.visitor_phone].filter(Boolean)
  return parts.join(' · ') || 'No contact info'
}

export default async function DashboardPage() {
  const [stats, recentMessages] = await Promise.all([
    getDashboardStats(),
    getRecentMessages(),
  ])

  const { totalProjects, totalMessages, unreadMessages } = stats

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="pt-2">
        <h1 className="text-3xl font-bold text-[#1a2b4a]">Dashboard</h1>
        <p className="mt-2 text-base text-slate-600">
          Welcome back — here&apos;s an overview of your portfolio activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={<FolderKanban className="h-7 w-7" />}
          color="blue"
        />
        <StatCard
          title="Total Messages"
          value={totalMessages}
          icon={<Mail className="h-7 w-7" />}
          color="emerald"
        />
        <StatCard
          title="Unread Messages"
          value={unreadMessages}
          icon={<MailOpen className="h-7 w-7" />}
          color="amber"
        />
      </div>

      {/* Recent Messages Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1a2b4a]">Recent Messages</h2>
          {recentMessages.length > 0 && (
            <Link
              href="/admin/inbox"
              className="text-sm font-medium text-[#0056b3] transition-colors hover:text-[#003d8a]"
            >
              View all →
            </Link>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {recentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 rounded-full bg-slate-100 p-3">
                <Mail className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                No messages yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                New contact form submissions will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentMessages.map((message, index) => (
                <li
                  key={message.id}
                >
                  <Link
                    href={`/admin/messages/${message.id}`}
                    className="block transition-colors hover:bg-slate-50/50"
                  >
                    <div className="flex items-start gap-4 px-6 py-4">
                      {/* Unread Indicator */}
                      <div className="mt-1 flex shrink-0 items-center">
                        {!message.is_read && (
                          <div className="h-3 w-3 rounded-full bg-[#0056b3]" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2">
                            <p
                              className={`truncate text-sm ${
                                !message.is_read
                                  ? 'font-bold text-[#1a2b4a]'
                                  : 'font-semibold text-slate-700'
                              }`}
                            >
                              {message.visitor_name}
                            </p>
                            {!message.is_read && (
                              <span className="inline-flex shrink-0 items-center rounded-full bg-[#0056b3] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                                New
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="shrink-0">
                              {formatMessageDate(message.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <p className="mt-1.5 truncate text-xs font-medium text-slate-500">
                          {getContactLine(message)}
                        </p>

                        {/* Message Preview */}
                        <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">
                          {getMessagePreview(message.message_body)}
                        </p>
                      </div>

                      {/* Arrow Indicator */}
                      <div className="mt-1 shrink-0 text-slate-300 transition-colors group-hover:text-slate-400">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
