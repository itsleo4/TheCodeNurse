'use client'

import { useState } from 'react'
import { Trash2, Loader2, AlertCircle } from 'lucide-react'
import { deleteMessage } from './actions'

export function DeleteMessageButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this clinical inquiry? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      await deleteMessage(id, true) // true means it will redirect to /admin/inbox
    } catch (err) {
      alert('Failed to delete message.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-red-500 shadow-sm ring-1 ring-slate-100 transition-all hover:bg-red-50 hover:text-red-600 hover:ring-red-100 active:scale-95 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      Delete Registry
    </button>
  )
}
