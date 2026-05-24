import Link from 'next/link'
import { FolderKanban, Mail, MailOpen } from 'lucide-react'
import {
  getDashboardStats,
  getRecentMessages,
  type RecentMessage,
} from '@/app/admin/lib/stats'

type StatCardProps = {
  title: string
  value: number
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#1a2b4a]">{value}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-[#0056b3]">{icon}</div>
      </div>
    </div>
  )
}

function formatMessageDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
}

function getMessagePreview(body: string): string {
  if (body.length <= 50) return body
  return `${body.slice(0, 50)}...`
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
      <div>
        <h1 className="text-2xl font-bold text-[#1a2b4a]">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back — here&apos;s an overview of your portfolio activity.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={<FolderKanban className="h-6 w-6" />}
        />
        <StatCard
          title="Total Messages"
          value={totalMessages}
          icon={<Mail className="h-6 w-6" />}
        />
        <StatCard
          title="Unread Messages"
          value={unreadMessages}
          icon={<MailOpen className="h-6 w-6" />}
        />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#1a2b4a]">
          Recent Messages
        </h2>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {recentMessages.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              No messages yet. New contact form submissions will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentMessages.map((message) => (
                <li key={message.id}>
                  <Link
                    href={`/admin/messages/${message.id}`}
                    className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                  >
                    <div
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        !message.is_read ? 'bg-[#0056b3]' : 'bg-transparent'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p
                            className={`truncate text-sm ${
                              !message.is_read
                                ? 'font-bold text-[#1a2b4a]'
                                : 'font-medium text-slate-700'
                            }`}
                          >
                            {message.visitor_name}
                          </p>
                          {!message.is_read && (
                            <span className="rounded-full bg-[#0056b3] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                              New
                            </span>
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-slate-400">
                          {formatMessageDate(message.created_at)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {getContactLine(message)}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-600">
                        {getMessagePreview(message.message_body)}
                      </p>
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
