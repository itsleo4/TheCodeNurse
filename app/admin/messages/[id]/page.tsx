import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

type MessageDetail = {
  id: string
  visitor_name: string
  visitor_email: string | null
  visitor_phone: string | null
  message_body: string
  is_read: boolean
  created_at: string
}

type MessagePageProps = {
  params: { id: string }
}

function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
}

function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/\D/g, '')
}

function buildWhatsAppUrl(phone: string, visitorName: string): string {
  const digits = formatPhoneForWhatsApp(phone)
  const text = encodeURIComponent(
    `Hi ${visitorName}, thank you for reaching out via TheCodeNurse. `
  )
  return `https://wa.me/${digits}?text=${text}`
}

function buildMailtoUrl(email: string, visitorName: string): string {
  const subject = encodeURIComponent(`Re: ${visitorName} - Inquiry`)
  const body = encodeURIComponent(
    `Hi ${visitorName},\n\nThank you for your message through TheCodeNurse portfolio.\n\n`
  )
  return `mailto:${email}?subject=${subject}&body=${body}`
}

/**
 * Fetches a single message and marks it as read before the page renders.
 */
async function getMessageAndMarkRead(id: string): Promise<MessageDetail | null> {
  const supabase = createClient()

  const { data: message, error } = await supabase
    .from('messages')
    .select(
      'id, visitor_name, visitor_email, visitor_phone, message_body, is_read, created_at'
    )
    .eq('id', id)
    .single()

  if (error || !message) {
    if (error) console.error('getMessageAndMarkRead error:', error)
    return null
  }

  if (!message.is_read) {
    const { error: updateError } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)

    if (updateError) {
      console.error('markAsRead error:', updateError)
    } else {
      message.is_read = true
    }
  }

  return message
}

export default async function MessageDetailPage({ params }: MessagePageProps) {
  const message = await getMessageAndMarkRead(params.id)

  if (!message) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h1 className="text-2xl font-bold text-[#1a2b4a]">Message not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This message may have been deleted or the link is invalid.
        </p>
        <Link
          href="/admin/dashboard"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0056b3] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const hasPhone =
    !!message.visitor_phone && formatPhoneForWhatsApp(message.visitor_phone).length > 0
  const hasEmail = !!message.visitor_email

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#0056b3] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#1a2b4a]">
                {message.visitor_name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {formatDateTime(message.created_at)}
              </p>
            </div>
            {!message.is_read && (
              <span className="rounded-full bg-[#0056b3] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                New
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {hasEmail ? (
              <a
                href={`mailto:${message.visitor_email}`}
                className="inline-flex items-center gap-1.5 text-[#0056b3] hover:underline"
              >
                <Mail className="h-4 w-4" />
                {message.visitor_email}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Mail className="h-4 w-4" />
                No email provided
              </span>
            )}
            {hasPhone ? (
              <a
                href={`tel:${message.visitor_phone}`}
                className="inline-flex items-center gap-1.5 text-[#0056b3] hover:underline"
              >
                <Phone className="h-4 w-4" />
                {message.visitor_phone}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Phone className="h-4 w-4" />
                No phone provided
              </span>
            )}
          </div>
        </div>

        <div className="px-6 py-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Message
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {message.message_body}
          </p>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">
            Quick Reply
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            {hasPhone ? (
              <a
                href={buildWhatsAppUrl(message.visitor_phone!, message.visitor_name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855]"
              >
                <MessageCircle className="h-5 w-5" />
                Reply on WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500"
              >
                <MessageCircle className="h-5 w-5" />
                No phone number
              </button>
            )}

            {hasEmail ? (
              <a
                href={buildMailtoUrl(message.visitor_email!, message.visitor_name)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0056b3] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#004494]"
              >
                <Mail className="h-5 w-5" />
                Reply via Email
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500"
              >
                <Mail className="h-5 w-5" />
                No email address
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Zero-budget replies — opens WhatsApp or your default email app with a
            pre-filled message.
          </p>
        </div>
      </div>
    </div>
  )
}
