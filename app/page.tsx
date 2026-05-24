import { createClient } from '@/lib/supabase/server'
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Mail, 
  ChevronRight, 
  Code2, 
  Cpu, 
  Globe, 
  ExternalLink,
  MessageSquare,
  Send,
  Heart,
  Stethoscope,
  Database,
  Zap,
  Flame
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { ContactForm } from '@/components/contact-form'

// --- Types ---
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

export default async function PortfolioPage() {
  const projects = await getProjects()
  
  const userDetails = {
    email: process.env.NEXT_PUBLIC_USER_EMAIL || 'odincalm@proton.me',
    github: process.env.NEXT_PUBLIC_USER_GITHUB || 'https://github.com/itsleo4',
    linkedin: process.env.NEXT_PUBLIC_USER_LINKEDIN || '#',
    instagram: process.env.NEXT_PUBLIC_USER_INSTAGRAM || 'https://instagram.com/odincalm0',
    heroImage: process.env.NEXT_PUBLIC_USER_HERO_IMAGE || 'https://i.ibb.co/tPwXrcWS/your-image.jpg'
  }

  return (
    <div className="relative overflow-x-hidden">
      {/* 1. NAVIGATION */}
      <Navigation />

      {/* 2. HERO SECTION */}
      <header className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-20 text-center">
        {/* Decorative background element */}
        <div className="absolute -top-40 -z-10 h-[600px] w-[600px] rounded-full bg-blue-50/50 blur-3xl" />
        
        <div className="mb-8 overflow-hidden rounded-3xl border-4 border-white shadow-2xl ring-1 ring-slate-100/50">
          <img 
            src={userDetails.heroImage} 
            alt="Hero Profile" 
            className="h-32 w-32 object-cover sm:h-48 sm:w-48"
          />
        </div>

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#0056b3]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0056b3]"></span>
            </span>
            Available for Clinical Digital Design
          </div>
          
          <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-[#1a2b4a] sm:text-7xl">
            Building the future of <span className="text-[#0056b3]">HealthTech</span> UI.
          </h1>
          
          <p className="mx-auto max-w-xl text-lg font-medium text-slate-500 sm:text-xl">
             I merge medical precision with digital excellence for global clinical workspace development.
          </p>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">
            <Link 
              href="/projects" 
              className="group flex items-center justify-center gap-2 rounded-2xl medical-gradient px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
              View My Work
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="flex items-center justify-center gap-4">
              <a href={userDetails.github} target="_blank" className="rounded-xl border border-slate-200 p-4 text-slate-400 transition-all hover:border-[#0056b3] hover:text-[#0056b3] active:scale-90 shadow-sm">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://t.me/odincalm" target="_blank" className="rounded-xl border border-slate-200 p-4 text-slate-400 transition-all hover:border-[#0056b3] hover:text-[#0056b3] active:scale-90 shadow-sm">
                <Send className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* 2.5 ABOUT ME SECTION */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-[#0056b3]">
              <div className="h-px w-8 bg-[#0056b3]" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Biography</span>
            </div>
            
            <h2 className="text-4xl font-black tracking-tight text-[#1a2b4a] sm:text-6xl">
              Precision in Care, <span className="text-[#0056b3]">Logic in Code.</span>
            </h2>
            
            <div className="space-y-6 text-lg font-medium leading-relaxed text-slate-500">
              <p>
                Hi, I’m <span className="font-black text-[#1a2b4a]">Nitin</span>. 👋
              </p>
              <p>
                I am a <span className="text-[#0056b3] font-bold">GNM Nursing Student 🩺</span> and a <span className="text-[#0056b3] font-bold">Full-Stack Developer 💻</span>. I understand that every second counts—whether in a hospital ward or a business meeting.
              </p>
              <p>
                I specialize in building high-converting, visually stunning websites without the overhead. I bring the discipline of a nurse and the creativity of a developer to every project.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
               {[
                 { name: 'Next.js', icon: Globe },
                 { name: 'Tailwind CSS', icon: Zap },
                 { name: 'Supabase', icon: Database },
                 { name: 'Firebase', icon: Flame },
               ].map((tech) => (
                 <div key={tech.name} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-5 py-3 ring-1 ring-slate-100 transition-all hover:ring-[#0056b3]/30">
                    <tech.icon className="h-4 w-4 text-[#0056b3]" />
                    <span className="text-sm font-bold text-[#1a2b4a]">{tech.name}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 rounded-[42px] bg-gradient-to-tr from-blue-50 to-white opacity-50 blur-2xl transition-all group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-[40px] border border-slate-100 bg-white p-10 shadow-2xl shadow-blue-100/30">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl medical-gradient text-white">
                 <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-black text-[#1a2b4a]">The Strategy</h3>
              <p className="mb-8 font-medium leading-relaxed text-slate-500">
                I leverage the best free tools to minimize costs for early-stage businesses, ensuring your website is professional from day one. As you grow, I scale your infrastructure to paid, high-performance tiers.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-[#0056b3]" />
                    <p className="text-sm font-bold text-[#1a2b4a]">Efficiency-First Mindset</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-[#0056b3]" />
                    <p className="text-sm font-bold text-[#1a2b4a]">Scalable Infrastructure</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-[#0056b3]" />
                    <p className="text-sm font-bold text-[#1a2b4a]">Clinical Attention to Detail</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-slate-50 bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg medical-gradient">
              <span className="text-[10px] font-black text-white">TCN</span>
            </div>
            <span className="text-lg font-black tracking-tight text-[#1a2b4a]">TheCodeNurse</span>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2">Copyright Portfolio</p>
            <p className="text-sm font-black text-slate-400">
              © 2026 Nitin Kumar. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex gap-4">
               <a href={userDetails.github} target="_blank" className="text-slate-300 transition-colors hover:text-[#0056b3]"><Github className="h-5 w-5" /></a>
               <a href={userDetails.instagram} target="_blank" className="text-slate-300 transition-colors hover:text-[#0056b3]"><Instagram className="h-5 w-5" /></a>
               <a href="https://t.me/odincalm" target="_blank" className="text-slate-300 transition-colors hover:text-[#0056b3]"><Send className="h-5 w-5" /></a>
            </div>
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0056b3]">
              Built by Nitin Kumar <Heart className="h-3 w-3 fill-current" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
