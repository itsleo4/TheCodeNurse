'use client'

import { useRef, useState } from 'react'
import { Plus, X, Loader2, Sparkles } from 'lucide-react'
import { addProject } from './actions'

export function AddProjectForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await addProject(formData)
      setIsOpen(false)
      formRef.current?.reset()
    } catch (err) {
      alert('Error adding project')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl medical-gradient px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
      >
        <Plus className="h-5 w-5" />
        Add New Project
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 shadow-inner ring-1 ring-white/50">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#0056b3]">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-xl font-bold">New Clinical Study</h2>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-2 text-slate-400 hover:bg-white hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Title</label>
          <input required name="title" className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0056b3]/20" placeholder="e.g. HealthDash Mobile" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Category</label>
          <select name="category" className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0056b3]/20">
            <option value="HealthTech">HealthTech</option>
            <option value="Web Dev">Web Dev</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Description</label>
          <textarea required name="description" rows={3} className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0056b3]/20" placeholder="Describe the clinical impact and technical challenges..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Technologies (comma separated)</label>
          <input name="technologies" className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0056b3]/20" placeholder="React, Supabase, Tailwind" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Image URL</label>
          <input name="image_url" className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0056b3]/20" placeholder="https://..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Demo Link</label>
          <input name="demo_link" className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0056b3]/20" placeholder="https://..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Repo Link</label>
          <input name="repo_link" className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0056b3]/20" placeholder="https://github.com/..." />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked className="h-4 w-4 rounded text-[#0056b3]" />
          <label htmlFor="is_active" className="text-sm font-bold text-slate-600">Publish immediately to live main web</label>
        </div>

        <div className="pt-4 sm:col-span-2">
           <button
             type="submit"
             disabled={loading}
             className="flex w-full items-center justify-center gap-2 rounded-xl medical-gradient py-4 text-sm font-bold text-white shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
           >
             {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
             Finalize and Add Project
           </button>
        </div>
      </form>
    </div>
  )
}
