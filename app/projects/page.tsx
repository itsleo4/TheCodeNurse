import { createClient } from '@/lib/supabase/server'
import { 
  Github, 
  Globe, 
  Code2, 
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'

type Project = {
  id: string
  title: string
  description: string
  category: string
  technologies: string[]
  image_url: string | null
  demo_link: string | null
  repo_link: string | null
}

async function getProjects(): Promise<Project[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  return data || []
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        <div className="mb-12 space-y-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#0056b3]"
          >
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="flex items-center gap-2 text-[#0056b3]">
            <div className="h-px w-8 bg-[#0056b3]" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Work Portfolio</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#1a2b4a] sm:text-5xl">Digital Implementations</h1>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-100 py-32 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0056b3]">
              <Code2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-400">Registry Empty</h3>
            <p className="text-sm text-slate-300">The clinical workspace catalog is currently being updated.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="group relative flex flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white transition-all hover:shadow-2xl hover:shadow-blue-100/50">
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                      <Globe className="h-16 w-16 text-blue-100" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-1 flex-col p-8">
                  <div className="mb-3 font-black uppercase tracking-widest text-[#0056b3] text-[10px]">
                    {project.category}
                  </div>
                  <h3 className="mb-3 text-2xl font-black tracking-tight text-[#1a2b4a]">{project.title}</h3>
                  <p className="mb-8 flex-1 text-sm font-medium leading-relaxed text-slate-500">{project.description}</p>
                  
                  <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                    {project.demo_link && (
                      <a href={project.demo_link} target="_blank" className="flex items-center gap-2 text-xs font-bold text-[#0056b3] transition-colors hover:text-[#1a2b4a]">
                        <Globe className="h-4 w-4" /> Live Demo
                      </a>
                    )}
                    {project.repo_link && (
                      <a href={project.repo_link} target="_blank" className="flex items-center gap-2 text-xs font-bold text-[#0056b3] transition-colors hover:text-[#1a2b4a]">
                        <Github className="h-4 w-4" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
