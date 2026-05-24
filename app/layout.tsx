import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TheCodeNurse — Clinical Digital Design & Development',
  description: 'Specialized HealthTech UI/UX design and development for clinical workspaces.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen antialiased bg-slate-50 text-[#1a2b4a]`}>
        {children}
      </body>
    </html>
  )
}
