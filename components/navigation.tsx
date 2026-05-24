'use client'

import { useState } from 'react'
import { Menu, X, Cpu, Github, Linkedin, Instagram, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { secureSignOut } from '@/app/login/actions'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAccessing, setIsAccessing] = useState(false)

  const handleSecureAccess = async () => {
    setIsAccessing(true)
    await secureSignOut()
  }

  const navLinks = [
    { href: '/#about', label: 'About Me' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg medical-gradient">
              <span className="text-sm font-black text-white">TCN</span>
            </div>
            <span className="text-xl font-black tracking-tight text-[#1a2b4a]">TheCodeNurse</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Discrete Admin Link (Microchip) - Now with Force Login */}
            <button 
              onClick={handleSecureAccess}
              disabled={isAccessing}
              className="group relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-200 transition-all hover:text-[#0056b3] hover:bg-blue-50 disabled:opacity-50"
              title="System Access"
            >
              {isAccessing ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#0056b3]" />
              ) : (
                <Cpu className="h-4 w-4" />
              )}
              <span className="absolute -bottom-8 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] text-white transition-all group-hover:scale-100 italic font-medium">Verify...</span>
            </button>

            {/* Hamburger Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[#0056b3] transition-all hover:bg-blue-100 active:scale-95"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 invisible'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center space-y-8 p-6 text-center">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0056b3]">Navigation</p>
            <div className="h-1 w-12 bg-[#0056b3] mx-auto rounded-full" />
          </div>

          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-4xl font-black tracking-tighter text-[#1a2b4a] transition-all hover:text-[#0056b3] hover:scale-110 active:scale-90"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-12">
            <div className="flex gap-4">
               <a href={process.env.NEXT_PUBLIC_USER_GITHUB} target="_blank" className="rounded-2xl bg-slate-50 p-4 text-slate-400 hover:text-[#0056b3] active:scale-90"><Github className="h-6 w-6" /></a>
               <a href={process.env.NEXT_PUBLIC_USER_LINKEDIN} target="_blank" className="rounded-2xl bg-slate-50 p-4 text-slate-400 hover:text-[#0056b3] active:scale-90"><Linkedin className="h-6 w-6" /></a>
               <a href={process.env.NEXT_PUBLIC_USER_INSTAGRAM} target="_blank" className="rounded-2xl bg-slate-50 p-4 text-slate-400 hover:text-[#0056b3] active:scale-90"><Instagram className="h-6 w-6" /></a>
               <a href="https://t.me/odincalm" target="_blank" className="rounded-2xl bg-slate-50 p-4 text-slate-400 hover:text-[#0056b3] active:scale-90"><Send className="h-6 w-6" /></a>
            </div>
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="mt-12 text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-slate-500"
          >
            Close Menu
          </button>
        </div>
      </div>
    </>
  )
}
