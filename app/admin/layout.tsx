'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Briefcase,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  X,
} from 'lucide-react'

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/inbox', label: 'Inbox', icon: Mail, matchMessages: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/admin/dashboard"
            className="text-xl font-bold tracking-tight text-[#0056b3]"
          >
            TheCodeNurse
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-md p-2 text-[#1a2b4a] transition-colors hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-900/35"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <Link
            href="/admin/dashboard"
            className="text-lg font-bold tracking-tight text-[#0056b3]"
          >
            TheCodeNurse
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navLinks.map(({ href, label, icon: Icon, matchMessages }) => {
            const isActive = matchMessages
              ? pathname === href || pathname.startsWith('/admin/messages')
              : pathname === href || pathname.startsWith(`${href}/`)

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#e8f1ff] text-[#0056b3]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#1a2b4a]'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 px-5 py-4">
          <p className="text-xs text-slate-500">TheCodeNurse Admin</p>
        </div>
      </aside>

      <main className="p-4">{children}</main>
    </div>
  )
}
