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
  ArrowLeft,
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
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#0056b3] transition-colors hover:text-[#003d8a]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0056b3]">
              <span className="text-sm font-bold text-white">TCN</span>
            </div>
            <span className="hidden sm:inline">TheCodeNurse</span>
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-2 text-[#1a2b4a] transition-colors hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#0056b3] transition-colors hover:text-[#003d8a]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0056b3]">
              <span className="text-sm font-bold text-white">TCN</span>
            </div>
            TheCodeNurse
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
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
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#e8f1ff] text-[#0056b3] shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#1a2b4a]'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </Link>
            )
          })}
          
          <div className="pt-4 mt-4 border-t border-slate-50">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-black text-red-600 transition-all hover:bg-red-50 hover:pl-6 active:scale-95 shadow-sm shadow-red-50"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back to Site</span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200 px-5 py-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            TheCodeNurse Admin
          </p>
          <p className="mt-1 text-xs text-slate-400">v1.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
