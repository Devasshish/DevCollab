import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Code2, Zap, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, loginWithGoogle } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please fill in all fields')
    if (!isLogin && password !== confirmPassword) return setError('Passwords do not match')
    setIsSubmitting(true)
    try {
      if (isLogin) { await login(email, password) } else { await register(email, password) }
      navigate(from, { replace: true })
    } catch (err) {
      if (err.code === 'auth/invalid-email') setError('Invalid email address')
      else if (err.code === 'auth/user-not-found') setError('No account found with this email')
      else if (err.code === 'auth/wrong-password') setError('Incorrect password')
      else if (err.code === 'auth/email-already-in-use') setError('Account already exists with this email')
      else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters')
      else setError(err.message || 'An error occurred. Please try again.')
    } finally { setIsSubmitting(false) }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setIsSubmitting(true)
    try { await loginWithGoogle(); navigate(from, { replace: true }) }
    catch (err) { setError(err.message || 'Failed to sign in with Google') }
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden page-bg">
      {/* Ambient orbs */}
      <div className="orb w-[500px] h-[500px] top-[-150px] left-[-100px] opacity-[0.07] animate-float-slow" style={{background:'radial-gradient(circle,#d4ff00,transparent)'}} />
      <div className="orb w-[400px] h-[400px] bottom-[-100px] right-[-100px] opacity-[0.06] animate-float" style={{background:'radial-gradient(circle,#a855f7,transparent)'}} />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(var(--text) 1px,transparent 1px),linear-gradient(90deg,var(--text) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />

      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-500 shadow-lg shadow-primary-500/30 mb-4 animate-pulse-glow">
            <Code2 className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-3xl font-black content-primary tracking-tight mb-1">
            {isLogin ? 'Welcome back' : 'Join DevCollab'}
          </h1>
          <p className="text-sm content-muted">
            {isLogin ? 'Sign in to access your workspace' : 'Create an account and start building'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-md rounded-3xl p-7 border" style={{ borderColor: 'var(--card-border)' }}>
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border content-muted hover:content-primary hover:bg-primary-500/10 transition-all duration-200 mb-5 text-sm font-semibold disabled:opacity-40"
            style={{ borderColor: 'var(--card-border)' }}
          >
            <svg className="w-4.5 h-4.5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px surface-muted" />
            <span className="text-[11px] content-faint uppercase tracking-widest">or</span>
            <div className="flex-1 h-px surface-muted" />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm text-red-400" style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)'}}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold content-muted uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 content-faint" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-premium pl-10" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold content-muted uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 content-faint" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-premium pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 content-faint hover:content-primary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold content-muted uppercase tracking-widest mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 content-faint" />
                  <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-premium pl-10" />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-xs text-primary-500/70 hover:text-primary-400 transition-colors">Forgot password?</a>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Please wait…
                </span>
              ) : (
                <><Zap className="w-4 h-4" /> {isLogin ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm content-muted">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={() => { setIsLogin(!isLogin); setError('') }}
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-xs content-faint">
          By continuing, you agree to our{' '}
          <a href="#" className="content-muted hover:text-primary-400 transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="content-muted hover:text-primary-400 transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}