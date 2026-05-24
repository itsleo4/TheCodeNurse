'use client'

import { useState } from 'react'
import { MessageSquare, Loader2, CheckCircle2 } from 'lucide-react'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        e.currentTarget.reset()
      } else {
        setError(data.error || 'Failed to send message')
      }
    } catch (err) {
      setError('Connection error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 p-8 sm:p-12 lg:p-20">
      {success ? (
        <div className="flex h-full flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
           <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-[#0056b3] shadow-inner shadow-blue-100">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1a2b4a]">Registry Received.</h3>
              <p className="text-sm font-medium text-slate-400">Thank you, doctor. Your inquiry has been secured in our clinical inbox.</p>
           </div>
           <button 
             onClick={() => setSuccess(false)}
             className="text-xs font-black uppercase tracking-widest text-[#0056b3] hover:underline"
           >
             Send another inquiry
           </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Registry Name</label>
              <input 
                required 
                name="name" 
                type="text" 
                placeholder="Dr. Nitin Kumar" 
                className="w-full border-b border-slate-100 bg-transparent py-2.5 text-base sm:text-lg font-bold text-[#1a2b4a] outline-none transition-all focus:border-[#0056b3]" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical Email</label>
              <input 
                required 
                name="email" 
                type="email" 
                placeholder="kumar.nitin@health.co" 
                className="w-full border-b border-slate-100 bg-transparent py-2.5 text-base sm:text-lg font-bold text-[#1a2b4a] outline-none transition-all focus:border-[#0056b3]" 
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mobile Number (Optional)</label>
              <input 
                name="phone" 
                type="tel" 
                placeholder="+91 00000 00000" 
                className="w-full border-b border-slate-100 bg-transparent py-2.5 text-base sm:text-lg font-bold text-[#1a2b4a] outline-none transition-all focus:border-[#0056b3]" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical Vision</label>
            <textarea 
              required 
              name="message" 
              rows={4} 
              placeholder="Protocol inquiry or project description..." 
              className="w-full border-b border-slate-100 bg-transparent py-2.5 text-base sm:text-lg font-bold text-[#1a2b4a] outline-none transition-all focus:border-[#0056b3] resize-none" 
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg ring-1 ring-red-100">
               {error}
            </p>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl sm:rounded-[24px] medical-gradient px-8 py-4 sm:px-12 sm:py-5 text-lg sm:text-xl font-black text-white transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-100/50 disabled:opacity-50"
          >
            {loading ? (
              <>
                Processing...
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
              </>
            ) : (
              <>
                Submit Inquiry
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
