import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-[#0056b3]">404</h1>
      <p className="mt-4 text-lg font-medium text-[#1a2b4a]">Page not found</p>
      <p className="mt-2 text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/login"
        className="mt-8 rounded-lg bg-[#0056b3] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#004494]"
      >
        Go to Login
      </Link>
    </div>
  )
}
