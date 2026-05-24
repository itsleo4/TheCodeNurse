'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { login, type LoginState } from './actions'

const initialState: LoginState = { error: null }

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0056b3] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#004494] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Logging in…' : 'Log In'}
      {!pending && <ArrowRight className="h-4 w-4" />}
    </button>
  )
}

type LoginFormProps = {
  redirectTo: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction] = useFormState(login, initialState)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <p className="mb-4 text-2xl font-bold text-[#0056b3]">TheCodeNurse</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#1a2b4a]">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Secure login for clinical portfolio management
        </p>
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@clinical.edu"
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/20"
              />
            </div>
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
          <a
            href="#"
            className="text-xs font-bold uppercase tracking-wide text-[#0056b3] hover:underline"
          >
            Forgot Password?
          </a>
          <p className="mt-3 text-xs text-slate-500">
            Need assistance?{' '}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-green-600 hover:underline"
            >
              WhatsApp Support
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-[#0056b3]">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          System Status: Operational
        </div>
        <p className="text-xs text-slate-400">
          © 2024 TheCodeNurse. All rights reserved. Professional Clinical Framework.
        </p>
      </div>
    </div>
  )
}
