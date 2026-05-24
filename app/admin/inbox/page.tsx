import { createClient } from '@/lib/supabase/server'
import { InboxList } from './inbox-list'

async function getMessages() {
  const supabase = createClient()
  const { data } = await supabase
    .from('messages')
    .select('id, visitor_name, visitor_email, message_body, is_read, created_at')
    .order('created_at', { ascending: false })
  
  return data || []
}

function formatMessageDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export default async function InboxPage() {
  const messages = await getMessages()

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-[#1a2b4a]">Inbox</h1>
        <p className="mt-2 text-base text-slate-600">
          Review and respond to inquiries from your clinical portfolio.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/40">
        <InboxList initialMessages={messages} />
      </div>
    </div>
  )
}
