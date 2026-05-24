import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TheCodeNurse — Admin Portal',
  description: 'Secure login for clinical portfolio management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
