import { Code2, Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const socials = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  const links = [
    { to: '/', label: 'Browse Projects' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/add-project', label: 'Add Project' },
    { to: '/login', label: 'Sign In' },
  ]

  const stack = ['React', 'JavaScript', 'Firebase', 'Tailwind CSS', 'Vite']

  return (
    <footer className="relative overflow-hidden surface-bg border-t" style={{ borderTopColor: 'var(--card-border)' }}>
      {/* Ambient glow - visible only in dark mode or subtle in light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #d4ff00, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/40 transition-shadow duration-300">
                <Code2 className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-black content-primary tracking-tight">
                Dev<span className="text-primary-500">Collab</span>
              </span>
            </Link>
            <p className="text-sm content-muted leading-relaxed mb-6 max-w-xs">
              The premier platform for developers to showcase projects, collect feedback, and build meaningful collaborations.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center content-faint hover:text-primary-400 hover:bg-primary-500/10 border border-white/5 hover:border-primary-500/20 transition-all duration-200"
                  style={{ borderColor: 'var(--card-border)' }}>
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest content-faint mb-5">Navigation</h4>
            <ul className="space-y-3">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="group flex items-center gap-1.5 text-sm content-muted hover:text-primary-400 transition-colors duration-200">
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Built with */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest content-faint mb-5">Built With</h4>
            <ul className="space-y-3">
              {stack.map(tech => (
                <li key={tech} className="text-sm content-muted">{tech}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="sep mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs content-faint">© {new Date().getFullYear()} DevCollab. All rights reserved.</p>
          <p className="text-xs content-faint">Made for developers, by developers.</p>
        </div>
      </div>
    </footer>
  )
}