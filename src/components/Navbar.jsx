import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun, Menu, X, Code2, Plus, LogOut, LayoutDashboard, User, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try { await logout() } catch (e) { console.error(e) }
  }

  const navLink = "relative px-4 py-2 text-sm font-semibold transition-colors duration-200 group hover:text-white"

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'glass border-b' : 'bg-transparent'}`}
      style={scrolled ? { borderBottomColor: 'var(--card-border)' } : {}}>
      {/* Gradient line at top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/40 transition-shadow duration-300 animate-pulse-glow">
                <Code2 className="w-5 h-5 text-black" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-primary-500/30 blur-md -z-10 group-hover:blur-lg transition-all duration-300" />
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-primary-400 transition-colors duration-300">
              Dev<span className="text-primary-500">Collab</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLink}>
              Browse
              <span className="absolute bottom-1 left-4 right-4 h-px bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className={navLink}>
                  Dashboard
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                <Link to={`/profile/${user.uid}`} className={navLink}>
                  Profile
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full glass flex items-center justify-center hover:border-primary-500/30 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-yellow-400" />
                : <Moon className="w-4 h-4 text-white/60" />
              }
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/add-project"
                  className="btn-primary text-xs gap-1.5 py-2 px-4"
                >
                  <Plus className="w-3.5 h-3.5" /> New Project
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full ring-1 ring-primary-500/40" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black text-xs font-black">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-white/80 max-w-[90px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-xs py-2 px-5 gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden w-9 h-9 glass rounded-full flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-primary-400 hover:bg-white/5 transition-all" onClick={() => setIsMenuOpen(false)}>Browse</Link>
          {user && (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-primary-400 hover:bg-white/5 transition-all" onClick={() => setIsMenuOpen(false)}><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
              <Link to={`/profile/${user.uid}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-primary-400 hover:bg-white/5 transition-all" onClick={() => setIsMenuOpen(false)}><User className="w-4 h-4" /> Profile</Link>
              <Link to="/add-project" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-primary-400 hover:bg-white/5 transition-all" onClick={() => setIsMenuOpen(false)}><Plus className="w-4 h-4" /> Add Project</Link>
            </>
          )}
          <div className="sep my-2" />
          <button onClick={() => { toggleTheme(); setIsMenuOpen(false) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all">
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          {user ? (
            <button onClick={() => { handleLogout(); setIsMenuOpen(false) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-full text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <Link to="/login" className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-400 hover:bg-white/5 transition-all" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}