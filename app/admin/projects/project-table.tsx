'use client'

import { useState } from 'react'
import { Plus, Trash2, Eye, EyeOff, Loader2, Edit3, X, Sparkles, Database, Zap, Globe, Flame } from 'lucide-react'
import { deleteProject, toggleProjectActive, editProject } from './actions'

type Project = {
  id: string
  title: string
  description: string
  category: string
  technologies: string[]
  image_url: string | null
  demo_link: string | null
  repo_link: string | null
  is_active: boolean
  created_at: string
}

export function ProjectTable({ projects }: { projects: Project[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    setLoadingId(id)
    try {
      await deleteProject(id)
    } finally {
      setLoadingId(null)
    }
  }

  const handleToggle = async (id: string, current: boolean) => {
    setLoadingId(id)
    try {
      await toggleProjectActive(id, current)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                  No projects found. Add your first clinical masterpiece.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#1a2b4a]">{project.title}</p>
                    <p className="text-[10px] text-slate-400">
                      Added {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-[#0056b3]">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleToggle(project.id, project.is_active)}
                        disabled={loadingId === project.id}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                          project.is_active
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {project.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {project.is_active ? 'Live' : 'Hidden'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => setEditingProject(project)}
                        disabled={loadingId === project.id}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-[#0056b3]"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={loadingId === project.id}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        {loadingId === project.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingProject && (
        <EditProjectModal 
          project={editingProject} 
          onClose={() => setEditingProject(null)} 
        />
      )}
    </div>
  )
}

function EditProjectModal({ project, onClose }: { project: Project, onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await editProject(project.id, formData)
      onClose()
    } catch (err) {
      alert('Error updating project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2b4a]/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0056b3]">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-xl font-bold italic">Edit Clinical Case Study</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Title</label>
            <input required name="title" defaultValue={project.title} className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0056b3]/20" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Category</label>
            <select name="category" defaultValue={project.category} className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0056b3]/20">
              <option value="HealthTech">HealthTech</option>
              <option value="Web Dev">Web Dev</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Description</label>
            <textarea required name="description" defaultValue={project.description} rows={3} className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0056b3]/20" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Technologies</label>
            <input name="technologies" defaultValue={project.technologies.join(', ')} className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0056b3]/20" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Thumbnail (Optional)</label>
            <input type="file" name="thumbnail" accept="image/*" className="w-full rounded-xl border border-dashed border-blue-200 bg-white px-4 py-1.5 text-xs text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-bold file:text-[#0056b3]" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Demo Link</label>
            <input name="demo_link" defaultValue={project.demo_link || ''} className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0056b3]/20" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">Repo Link</label>
            <input name="repo_link" defaultValue={project.repo_link || ''} className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0056b3]/20" />
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" name="is_active" id="is_active_edit" defaultChecked={project.is_active} className="h-4 w-4 rounded text-[#0056b3]" />
            <label htmlFor="is_active_edit" className="text-sm font-bold text-slate-600">Keep published on live site</label>
          </div>

          <div className="pt-4 sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl medical-gradient py-4 text-sm font-bold text-white shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Save Clinical Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
