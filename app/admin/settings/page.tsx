import { Settings as SettingsIcon, Shield, User, Globe, Link2 } from 'lucide-react'

export default function SettingsPage() {
  const envVars = [
    { label: 'Supabase URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL, icon: Globe },
    { label: 'Public Email', value: process.env.NEXT_PUBLIC_USER_EMAIL, icon: User },
    { label: 'GitHub Link', value: process.env.NEXT_PUBLIC_USER_GITHUB, icon: Link2 },
    { label: 'Hero Image Link', value: process.env.NEXT_PUBLIC_USER_HERO_IMAGE, icon: Shield },
  ]

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-[#1a2b4a]">Settings</h1>
        <p className="mt-2 text-base text-slate-600">
          Global configuration and environment status for TheCodeNurse.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Environment Status Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
           <div className="mb-8 flex items-center gap-3 text-[#0056b3]">
              <Shield className="h-6 w-6" />
              <h2 className="text-xl font-bold">System Environment</h2>
           </div>
           
           <div className="space-y-6">
              {envVars.map((env) => (
                <div key={env.label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-6">
                   <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-slate-50 p-2.5 text-slate-400">
                         <env.icon className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{env.label}</p>
                         <p className="text-sm font-bold text-[#1a2b4a] mt-0.5 max-w-xs truncate sm:max-w-md">
                            {env.value || 'Not Configured'}
                         </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                       <div className={`h-2 w-2 rounded-full ${env.value ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-amber-500'}`} />
                       <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                          {env.value ? 'Synced' : 'Missing'}
                       </span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Security Info */}
        <div className="rounded-3xl medical-gradient p-8 text-white shadow-xl shadow-blue-200">
           <div className="flex items-start gap-6">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                 <SettingsIcon className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black tracking-tight">Configuration Mode</h3>
                 <p className="text-blue-100/70 font-medium">To update these values, modify the <code className="bg-white/10 px-2 py-0.5 rounded text-white italic">.env</code> file in your local workspace. Changes will reflect instantly upon refresh.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
