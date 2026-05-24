import { 
  Mail, 
  Instagram, 
  Send,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { ContactForm } from '@/components/contact-form'

export default function ContactPage() {
  const userDetails = {
    email: process.env.NEXT_PUBLIC_USER_EMAIL || 'odincalm@proton.me',
    instagram: process.env.NEXT_PUBLIC_USER_INSTAGRAM || 'https://instagram.com/odincalm0',
  }

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6">
        <div className="mb-12 space-y-4 px-2">
           <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#0056b3]"
          >
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="flex items-center gap-2 text-[#0056b3]">
            <div className="h-px w-8 bg-[#0056b3]" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Communication</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#1a2b4a] sm:text-5xl">Clinical Inquiry</h1>
        </div>

        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[48px] medical-gradient p-1">
          <div className="relative flex flex-col overflow-hidden rounded-[30px] sm:rounded-[46px] bg-white lg:flex-row">
            {/* Contact Info Header */}
            <div className="medical-gradient flex flex-col justify-between p-8 sm:p-12 text-white lg:min-h-[600px] lg:w-2/5 lg:p-16">
               <div className="space-y-4 sm:space-y-6">
                 <h2 className="text-3xl font-black tracking-tighter sm:text-5xl">Let&apos;s talk health.</h2>
                 <p className="text-base font-medium text-blue-100/80 sm:text-lg">
                    Ready to digitize your medical workspace? Inquire about clinical digital solutions.
                 </p>
               </div>
               
               <div className="mt-12 space-y-6 sm:mt-16 sm:space-y-8">
                 <a href={`mailto:${userDetails.email}`} className="flex items-center gap-4 group">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md transition-all group-hover:bg-white group-hover:text-[#0056b3]">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="font-bold text-base sm:text-lg truncate">{userDetails.email}</span>
                 </a>
                 <a href={userDetails.instagram} target="_blank" className="flex items-center gap-4 group">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md transition-all group-hover:bg-white group-hover:text-[#0056b3]">
                      <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="font-bold text-base sm:text-lg">@odincalm0</span>
                 </a>
                 <a href="https://t.me/odincalm" target="_blank" className="flex items-center gap-4 group">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md transition-all group-hover:bg-white group-hover:text-[#0056b3]">
                      <Send className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="font-bold text-base sm:text-lg">@odincalm</span>
                 </a>
               </div>
            </div>

            {/* Form Component */}
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  )
}
