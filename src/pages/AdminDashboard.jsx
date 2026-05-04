import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { Trash2, ExternalLink, Shield, Key, Database, MessageSquare, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'

export default function AdminDashboard() {
  const [projects, setProjects] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      const p = []
      snap.forEach(doc => p.push({ id: doc.id, ...doc.data() }))
      setProjects(p)
    })

    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snap) => {
      const r = []
      snap.forEach(doc => r.push({ id: doc.id, ...doc.data() }))
      setReviews(r)
      setLoading(false)
    })

    return () => {
      unsubProjects()
      unsubReviews()
    }
  }, [])

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id))
    }
  }

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteDoc(doc(db, 'reviews', id))
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === 'admin1309') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid credentials')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient background */}
        <div className="orb w-96 h-96 -top-20 -left-20 opacity-10 bg-red-500 blur-[100px]" />
        
        <div className="card rounded-3xl p-10 w-full max-w-md relative z-10 border border-white/5 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 glow">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black content-primary tracking-tight">Vault Access</h2>
            <p className="text-sm content-muted">Admin authentication required.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
               <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 content-faint" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-premium pl-11 py-3.5"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-premium py-3.5"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-black shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
            >
              Authorize Access <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen page-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Shield className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black content-primary tracking-tight">Admin Control</h1>
            <p className="text-sm content-muted">Manage system data and community activity.</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Database className="w-32 h-32" />
            </div>
            <h3 className="text-sm font-bold content-muted uppercase tracking-widest mb-2">Total Projects</h3>
            <p className="text-5xl font-black text-primary-500">{projects.length}</p>
          </div>
          <div className="card rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <MessageSquare className="w-32 h-32" />
            </div>
            <h3 className="text-sm font-bold content-muted uppercase tracking-widest mb-2">Total Reviews</h3>
            <p className="text-5xl font-black text-primary-500">{reviews.length}</p>
          </div>
        </div>

        {/* Tables Container */}
        <div className="space-y-12">
          {/* Projects Table */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black content-primary tracking-tight">Project Directory</h2>
              <span className="text-xs content-faint font-bold uppercase tracking-widest">{projects.length} entries</span>
            </div>
            <div className="card rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="surface-muted text-xs font-bold content-faint uppercase tracking-widest border-b border-white/5">
                      <th className="px-6 py-5">Project</th>
                      <th className="px-6 py-5">Author</th>
                      <th className="px-6 py-5">Date</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-5">
                          <Link to={`/project/${p.id}`} className="font-bold content-primary hover:text-primary-400 flex items-center gap-2 group">
                            {p.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </td>
                        <td className="px-6 py-5 text-sm content-muted">{p.authorName}</td>
                        <td className="px-6 py-5 text-sm content-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => handleDeleteProject(p.id)} className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Reviews Table */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black content-primary tracking-tight">Review Logs</h2>
              <span className="text-xs content-faint font-bold uppercase tracking-widest">{reviews.length} entries</span>
            </div>
            <div className="card rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="surface-muted text-xs font-bold content-faint uppercase tracking-widest border-b border-white/5">
                      <th className="px-6 py-5">Content</th>
                      <th className="px-6 py-5">User</th>
                      <th className="px-6 py-5">Score</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reviews.map(r => (
                      <tr key={r.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-5 text-sm content-muted max-w-xs truncate">{r.reviewText}</td>
                        <td className="px-6 py-5 text-sm content-muted">{r.userName}</td>
                        <td className="px-6 py-5">
                          <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-black">
                            {r.rating} / 5
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => handleDeleteReview(r.id)} className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
