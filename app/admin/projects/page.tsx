import { createClient } from '@/lib/supabase/server'
import { Briefcase, Info } from 'lucide-react'
import { ProjectTable } from './project-table'
import { AddProjectForm } from './add-project-form'

async function getProjects() {
  const supabase = createClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  return data || []
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
        <div>
          <h1 className="text-3xl font-bold text-[#1a2b4a]">Projects</h1>
          <p className="mt-2 text-base text-slate-600">
            Manage your clinical portfolio and published digital works.
          </p>
        </div>
        <AddProjectForm />
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/30 p-4">
        <Info className="h-5 w-5 text-[#0056b3] mt-0.5" />
        <div className="text-sm text-[#0056b3]/80">
          <p className="font-bold">Portfolio Management Tip</p>
          <p>Toggling a project to &quot;Hidden&quot; removes it instantly from the main portfolio web without deleting the record.</p>
        </div>
      </div>

      {/* Main Table */}
      <ProjectTable projects={projects} />
      
      {/* Statistics Footer */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
        <Briefcase className="h-4 w-4" />
        {projects.length} Total Registered Projects
      </div>
    </div>
  )
}
