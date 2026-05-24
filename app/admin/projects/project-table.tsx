'use client'

import { useState } from 'react'
import { Plus, Trash2, ExternalLink, Github, Eye, EyeOff, Loader2 } from 'lucide-react'
import { deleteProject, toggleProjectActive } from './actions'

type Project = {
  id: string
  title: string
  category: string
  is_active: boolean
  created_at: string
}

export function ProjectTable({ projects }: { projects: Project[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

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
  )
}
