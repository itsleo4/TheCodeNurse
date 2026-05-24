import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { type RecentMessage } from '@/app/admin/lib/stats'
import { DeleteMessageButton } from '../delete-button'

export default async function MessageDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  // 1. Fetch message
  const { data: message, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !message) {
    return notFound()
  }

  // 2. Mark as read if not already read (Server-side update)
  if (!message.is_read) {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', params.id)
  }

  const typedMessage = message as RecentMessage

  // 3. Prepare Answer Links
  const whatsappLink = typedMessage.visitor_phone 
    ? `https://wa.me/${typedMessage.visitor_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${typedMessage.visitor_name}, thank you for contacting TheCodeNurse. I'm following up on your message: "${typedMessage.message_body.slice(0, 50)}..."`)}`
    : null

  const emailLink = `mailto:${typedMessage.visitor_email}?subject=Re: Inquiry from ${typedMessage.visitor_name} - TheCodeNurse&body=${encodeURIComponent(`Hi ${typedMessage.visitor_name},\n\nThank you for reaching out.\n\n--- Your Original Message ---\n${typedMessage.message_body}`)}`

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="group flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#0056b3]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition-all group-hover:ring-[#0056b3]/30 group-hover:bg-blue-50">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Inbox
        </Link>
        <div className="flex items-center gap-2">
          {typedMessage.is_read ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Message Read
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-[#0056b3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              New Message
            </span>
          )}
          <DeleteMessageButton id={params.id} />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
        {/* Header Header */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white px-8 py-10 sm:px-12">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0056b3]">Sender Details</p>
              <h1 className="text-4xl font-black tracking-tight text-[#1a2b4a] sm:text-5xl">
                {typedMessage.visitor_name}
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                }).format(new Date(typedMessage.created_at))}
              </span>
            </div>
          </div>
        </div>

        <div className="px-8 py-10 sm:px-12">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Left Column: Contact & Stats */}
            <div className="space-y-8 lg:col-span-1">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Contact Method</h3>
                
                <div className="space-y-3">
                  <a
                    href={`mailto:${typedMessage.visitor_email}`}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-[#0056b3]/30 hover:shadow-md active:scale-95"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0056b3] transition-colors group-hover:bg-[#0056b3] group-hover:text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#1a2b4a]">{typedMessage.visitor_email}</p>
                      <p className="text-[10px] font-semibold uppercase text-slate-400">Personal Email</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>

                  {typedMessage.visitor_phone ? (
                    <a
                      href={`tel:${typedMessage.visitor_phone}`}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md active:scale-95"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#1a2b4a]">{typedMessage.visitor_phone}</p>
                        <p className="text-[10px] font-semibold uppercase text-slate-400">Phone Number</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-50 bg-slate-50/50 p-4 opacity-60">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-400">Not provided</p>
                        <p className="text-[10px] font-semibold uppercase text-slate-300">Phone Number</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Message Content */}
            <div className="space-y-8 lg:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0056b3]">
                    <MessageSquare className="h-4 w-4" />
                    Message Content
                  </h3>
                </div>
                <div className="relative overflow-hidden rounded-3xl bg-slate-50 p-8 shadow-inner ring-1 ring-slate-100">
                  {/* Decorative quote mark */}
                  <div className="absolute -left-2 -top-2 select-none text-9xl font-black text-slate-200/50 opacity-50">
                    &ldquo;
                  </div>
                  <p className="relative z-10 whitespace-pre-wrap text-lg leading-relaxed text-[#1a2b4a]">
                    {typedMessage.message_body}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 py-5 text-base font-bold text-white transition-all hover:bg-[#1fb855] hover:shadow-xl hover:shadow-emerald-200 active:scale-95"
                  >
                    Reply on WhatsApp
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-slate-100 px-8 py-5 text-base font-bold text-slate-400"
                  >
                    No WhatsApp Number
                  </button>
                )}
                
                <a
                  href={emailLink}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-[#0056b3] px-8 py-5 text-base font-bold text-white transition-all hover:bg-[#003d8a] hover:shadow-xl hover:shadow-blue-200 active:scale-95"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="flex items-center justify-center gap-2 bg-slate-50/50 py-6 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <CheckCircle2 className="h-3 w-3" />
          End of message thread
        </div>
      </div>
    </div>
  )
}
