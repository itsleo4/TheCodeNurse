'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Mail, 
  MailOpen, 
  ChevronRight, 
  Trash2, 
  Loader2, 
  CheckSquare, 
  Square, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { deleteMessage, deleteMultipleMessages, deleteAllMessages } from '../messages/actions'

type Message = {
  id: string
  visitor_name: string
  visitor_email: string | null
  message_body: string
  is_read: boolean
  created_at: string
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export function InboxList({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === messages.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(messages.map(m => m.id))
    }
  }

  const handleBulkDelete = async () => {
    setLoading(true)
    try {
      const res = await deleteMultipleMessages(selectedIds)
      if (res?.error) {
        alert(`Server Error: ${res.error}`)
      } else {
        setMessages(messages.filter(m => !selectedIds.includes(m.id)))
        setSelectedIds([])
      }
    } catch (err) {
      alert('Network Error during bulk delete')
    } finally {
      setLoading(false)
    }
  }

  const handleClearAll = async () => {
    setIsDeletingAll(true)
    try {
      const res = await deleteAllMessages()
      if (res?.error) {
        alert(`Server Error: ${res.error}`)
      } else {
        setMessages([])
        setSelectedIds([])
      }
    } catch (err) {
      alert('Network Error during wipe')
    } finally {
      setIsDeletingAll(false)
    }
  }

  const handleDeleteSingle = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    try {
      const res = await deleteMessage(id)
      if (res?.error) {
        alert(`Server Error: ${res.error}`)
      } else {
        setMessages(messages.filter(m => m.id !== id))
      }
    } catch (err) {
      alert('Network Error during delete')
    } finally {
      setLoading(false)
    }
  }

  if (messages.length === 0 && !isDeletingAll) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-4 rounded-3xl bg-slate-50 p-6">
          <MailOpen className="h-10 w-10 text-slate-200" />
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Inbox Zero</p>
        <p className="text-xs text-slate-300 mt-2 italic">Clean slate. System ready for new logs.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Bulk Action Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
           <button 
             onClick={toggleSelectAll}
             className="flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-50"
           >
             {selectedIds.length === messages.length && messages.length > 0 ? (
               <CheckSquare className="h-4 w-4 text-[#0056b3]" />
             ) : (
               <Square className="h-4 w-4" />
             )}
             {selectedIds.length === messages.length ? 'Unselect All' : 'Select All'}
           </button>
           
           {selectedIds.length > 0 && (
             <span className="text-xs font-bold text-[#0056b3] bg-blue-50 px-2 py-1 rounded-full">
                {selectedIds.length} Selected
             </span>
           )}
        </div>

        <div className="flex items-center gap-2">
           {selectedIds.length > 0 && (
             <button
               onClick={handleBulkDelete}
               disabled={loading}
               className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50"
             >
               {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
               Delete Selected
             </button>
           )}

           <button
             onClick={handleClearAll}
             disabled={isDeletingAll}
             className="flex items-center gap-2 rounded-xl border border-slate-100 px-4 py-2 text-xs font-bold text-slate-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-600 active:scale-95"
           >
             {isDeletingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
             Wipe Entire Inbox
           </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/40">
        <div className="divide-y divide-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`group relative flex items-center transition-all ${
              selectedIds.includes(msg.id) ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'
            }`}>
              {/* Checkbox Area */}
              <div className="pl-6 py-6">
                 <button 
                   onClick={() => toggleSelect(msg.id)}
                   className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all ${
                     selectedIds.includes(msg.id) ? 'bg-[#0056b3] text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-200 hover:bg-slate-100'
                   }`}
                 >
                   <CheckCircle2 className={`h-4 w-4 ${selectedIds.includes(msg.id) ? 'opacity-100' : 'opacity-0'}`} />
                 </button>
              </div>

              <Link
                href={`/admin/messages/${msg.id}`}
                className="flex flex-1 items-center gap-4 px-6 py-6"
              >
                 <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all ${
                   !msg.is_read ? 'bg-blue-50 text-[#0056b3] shadow-inner shadow-blue-100/30' : 'bg-white text-slate-200 border border-slate-100'
                 }`}>
                    {msg.is_read ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                 </div>
                 
                 <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                       <p className={`truncate text-base ${!msg.is_read ? 'font-black text-[#1a2b4a]' : 'font-bold text-slate-400'}`}>
                          {msg.visitor_name}
                       </p>
                       <span className="shrink-0 text-[10px] font-black uppercase text-slate-300">
                          {formatDate(msg.created_at)}
                       </span>
                    </div>
                    <p className="line-clamp-1 text-sm font-medium text-slate-500 mt-1">
                       {msg.message_body}
                    </p>
                 </div>

                 <ChevronRight className="h-5 w-5 text-slate-200 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Single Deletion (PC Only) */}
              <div className="pr-6 opacity-0 transition-all group-hover:opacity-100 hidden sm:block">
                <button
                  onClick={(e) => handleDeleteSingle(e, msg.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm ring-1 ring-slate-100 hover:bg-red-50 hover:text-red-600 hover:ring-red-100 transition-all active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
