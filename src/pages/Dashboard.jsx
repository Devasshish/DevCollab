import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, Code2, Calendar, Star, TrendingUp, Bookmark } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'
import { collection, query, where, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import Modal from '../components/Modal'
import Loader from '../components/Loader'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [userProjects, setUserProjects] = useState([])
  const [savedProjects, setSavedProjects] = useState([])
  const [activeTab, setActiveTab] = useState('my-projects')

  useEffect(() => {
    if (!user) { setUserProjects([]); return }

    const q = query(collection(db, 'projects'), where('authorId', '==', user.uid))
    const unsub = onSnapshot(q, snap => {
      const projects = []
      snap.forEach(d => projects.push({ id: d.id, ...d.data() }))
      setUserProjects(projects)
    })

    const qB = query(collection(db, 'bookmarks'), where('userId', '==', user.uid))
    const unsubB = onSnapshot(qB, async snap => {
      const ids = snap.docs.map(d => d.data().projectId)
      if (!ids.length) { setSavedProjects([]); return }
      const fetched = []
      for (const pid of ids) {
        const s = await getDoc(doc(db, 'projects', pid))
        if (s.exists()) fetched.push({ id: s.id, ...s.data() })
      }
      setSavedProjects(fetched)
    })

    return () => { unsub(); unsubB() }
  }, [user])

  const handleDeleteClick = id => { setProjectToDelete(id); setShowDeleteModal(true) }
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return
    try { await deleteDoc(doc(db, 'projects', projectToDelete)) } catch (e) { console.error(e) }
    setShowDeleteModal(false); setProjectToDelete(null)
  }
  const formatDate = ts => new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  if (authLoading) return <Loader />

  const totalReviews = userProjects.reduce((a, p) => a + (p.reviewCount || 0), 0)
  const avgRating = userProjects.length
    ? (userProjects.reduce((a, p) => a + (p.averageRating || 0), 0) / userProjects.length).toFixed(1)
    : '—'

  const stats = [
    { icon: Code2, value: userProjects.length, label: 'Projects', color: '#d4ff00', bg: 'rgba(212,255,0,0.08)' },
    { icon: Star, value: totalReviews, label: 'Reviews', color: '#facc15', bg: 'rgba(250,204,21,0.08)' },
    { icon: TrendingUp, value: avgRating, label: 'Avg Rating', color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
  ]

  const tabs = [
    { id: 'my-projects', label: 'My Projects', count: userProjects.length },
    { id: 'saved', label: 'Saved', count: savedProjects.length },
  ]

  const activeProjects = activeTab === 'my-projects' ? userProjects : savedProjects

  return (
    <div className="min-h-screen page-bg py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="relative rounded-3xl p-7 mb-8 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(212,255,0,0.1) 0%,rgba(168,85,247,0.08) 50%,rgba(59,130,246,0.06) 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="absolute inset-0 mesh-bg" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-16 h-16 rounded-2xl ring-2 ring-primary-500/30" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black text-2xl font-black ring-2 ring-primary-500/30">
                  {user?.email?.[0].toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">{user?.displayName || 'Developer'}</h1>
                <p className="text-sm text-white/40 mt-0.5">{user?.email}</p>
              </div>
            </div>
            <Link to="/add-project" className="btn-primary gap-2 py-2.5 px-5 text-sm">
              <Plus className="w-4 h-4" /> New Project
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label} className="glass rounded-2xl p-5 flex items-center gap-4 card-lift border border-white/5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-white/35 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + Table */}
        <div className="glass rounded-3xl overflow-hidden border border-white/5">
          {/* Tab bar */}
          <div className="flex items-center gap-1 p-2 border-b border-white/5">
            {tabs.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {label}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === id ? 'bg-black/20 text-black' : 'bg-white/8 text-white/40'}`}>{count}</span>
              </button>
            ))}
          </div>

          {/* Project list */}
          {activeProjects.length > 0 ? (
            <div className="divide-y divide-white/5">
              {activeProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between p-5 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-10 rounded-xl overflow-hidden bg-dark-card flex-shrink-0 border border-white/5">
                      <img
                        src={project.imageUrl || (project.demoLink ? `https://api.microlink.io/?url=${encodeURIComponent(project.demoLink)}&screenshot=true&meta=false&embed=screenshot.url` : 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200')}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/project/${project.id}`} className="text-sm font-bold text-white hover:text-primary-400 transition-colors truncate block">
                        {project.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-white/25 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{formatDate(project.createdAt)}
                        </span>
                        {project.averageRating > 0 && (
                          <span className="text-xs text-yellow-400/70 flex items-center gap-1">
                            <Star className="w-3 h-3" />{project.averageRating?.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-4">
                    <Link to={`/project/${project.id}`}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/5 transition-all" title="View">
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    {activeTab === 'my-projects' && (
                      <>
                        <Link to={`/edit/${project.id}`}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-primary-400 hover:bg-primary-500/10 transition-all" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => handleDeleteClick(project.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass mb-5 border border-white/5">
                {activeTab === 'my-projects' ? <Code2 className="w-6 h-6 text-white/15" /> : <Bookmark className="w-6 h-6 text-white/15" />}
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {activeTab === 'my-projects' ? 'No projects yet' : 'No saved projects'}
              </h3>
              <p className="text-sm text-white/30 mb-6">
                {activeTab === 'my-projects' ? 'Share your work with the community.' : 'Bookmark projects you find interesting.'}
              </p>
              <Link
                to={activeTab === 'my-projects' ? '/add-project' : '/'}
                className="btn-primary text-xs gap-1.5 py-2 px-5"
              >
                {activeTab === 'my-projects' ? <><Plus className="w-3.5 h-3.5" /> Add Project</> : 'Browse Projects'}
              </Link>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setProjectToDelete(null) }}
          title="Delete Project"
          footer={
            <>
              <button onClick={() => { setShowDeleteModal(false); setProjectToDelete(null) }}
                className="btn-ghost text-sm py-2 px-4">Cancel</button>
              <button onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-bold">Delete</button>
            </>
          }
        >
          <p className="text-sm text-white/50">Are you sure you want to delete this project? This action cannot be undone.</p>
        </Modal>
      </div>
    </div>
  )
}