import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const socials = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="relative overflow-hidden surface-bg border-t border-[var(--card-border)] mt-20 pt-20 pb-8">
      {/* Massive Background Text Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center pointer-events-none overflow-hidden select-none z-0">
        <h1 className="text-[18vw] font-black tracking-tighter opacity-[0.03] whitespace-nowrap">
          DEVCOLLAB
        </h1>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        <Link to="/" className="inline-flex items-center gap-4 mb-6 group">
          <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb-comma),0.3)] group-hover:shadow-[0_0_50px_rgba(var(--primary-rgb-comma),0.5)] transition-all duration-300 group-hover:scale-105">
            <Code2 className="w-7 h-7 text-black" />
          </div>
          <span className="text-4xl font-black content-primary tracking-tight">
            Dev<span className="text-primary-500">Collab</span>
          </span>
        </Link>
        
        <p className="text-lg content-muted leading-relaxed max-w-lg font-medium mb-10">
          The premier platform for developers to showcase projects, collect feedback, and build meaningful collaborations.
        </p>
        


        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <p className="text-sm font-bold content-faint">
            © {new Date().getFullYear()} DevCollab. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full surface-muted border border-[var(--card-border)] text-xs font-bold content-muted shadow-inner cursor-default hover:border-green-500/30 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Systems Operational
          </div>
        </div>
      </div>
    </footer>
  )
}