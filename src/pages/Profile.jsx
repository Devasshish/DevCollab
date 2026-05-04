import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Code2, Star, MessageSquare, ArrowLeft, Edit2, AlertCircle } from 'lucide-react'
import { db } from '../firebase/config'
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'
import ProjectCard from '../components/ProjectCard'
import Modal from '../components/Modal'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { userId } = useParams()
  const { user } = useAuth()
  const isOwner = user?.uid === userId

  const [userProjects, setUserProjects] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', bio: '', photoURL: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('projects')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const userDocSnap = await getDoc(doc(db, 'users', userId))
        if (userDocSnap.exists()) setUserData(userDocSnap.data())

        const pSnap = await getDocs(query(collection(db, 'projects'), where('authorId', '==', userId)))
        setUserProjects(pSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt))

        const rSnap = await getDocs(query(collection(db, 'reviews'), where('userId', '==', userId)))
        setUserReviews(rSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    if (userId) fetchUserData()
  }, [userId])

  const profile = useMemo(() => {
    if (userData) return { name: userData.name || 'Developer', photoURL: userData.photoURL || '', bio: userData.bio || 'Developer building great products', joinDate: userData.joinDate || Date.now() }
    if (userProjects.length > 0) return { name: userProjects[0].authorName || 'Developer', photoURL: userProjects[0].authorPhoto || '', bio: 'Developer building great products', joinDate: userProjects[userProjects.length - 1].createdAt || Date.now() }
    if (userReviews.length > 0) return { name: userReviews[0].userName || 'Developer', photoURL: userReviews[0].userPhoto || '', bio: 'Community member', joinDate: userReviews[userReviews.length - 1].createdAt || Date.now() }
    return { name: 'Developer', photoURL: '', bio: 'New member', joinDate: Date.now() }
  }, [userProjects, userReviews, userData])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!isOwner) return
    setIsSaving(true)
    try {
      const dataToSave = { name: editForm.name, bio: editForm.bio, photoURL: editForm.photoURL, joinDate: profile.joinDate }
      await setDoc(doc(db, 'users', userId), dataToSave, { merge: true })
      setUserData(dataToSave)
      setShowEditModal(false)
    } catch (e) { console.error(e) }
    finally { setIsSaving(false) }
  }

  const formatDate = ts => ts ? new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''
  const totalReviews = userProjects.reduce((a, p) => a + (p.reviewCount || 0), 0)

  if (loading) return (
    <div className="min-h-screen page-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )

  const stats = [
    { icon: Code2, value: userProjects.length, label: 'Projects', color: '#d4ff00' },
    { icon: Star, value: totalReviews, label: 'Reviews Received', color: '#facc15' },
    { icon: MessageSquare, value: userReviews.length, label: 'Reviews Written', color: '#34d399' },
  ]

  const tabs = [
    { id: 'projects', label: 'Projects', count: userProjects.length },
    { id: 'reviews', label: 'Reviews Written', count: userReviews.length },
  ]

  return (
    <div className="min-h-screen page-bg py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-primary-400 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to projects
        </Link>

        {/* Profile header card */}
        <div className="card rounded-3xl overflow-hidden mb-8">
          {/* Banner with mesh gradient */}
          <div className="relative h-36 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(212,255,0,0.12) 0%, rgba(168,85,247,0.08) 50%, rgba(59,130,246,0.08) 100%)' }}>
            <div className="absolute inset-0 mesh-bg" />
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
            {/* Orb */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #d4ff00, transparent)', filter: 'blur(30px)' }} />
          </div>

          <div className="px-8 pb-8">
            {/* Avatar row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-14 mb-6 gap-4">
              <div className="flex items-end gap-4">
                <div className="relative flex-shrink-0">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt={profile.name}
                      className="w-24 h-24 rounded-2xl ring-4 shadow-xl"
                      style={{ ringColor: 'var(--card-bg)', boxShadow: '0 0 0 4px var(--card-bg), 0 8px 30px rgba(0,0,0,0.4)' }} />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black text-3xl font-black shadow-xl"
                      style={{ boxShadow: '0 0 0 4px var(--card-bg), 0 8px 30px rgba(0,0,0,0.4)' }}>
                      {profile.name[0]}
                    </div>
                  )}
                  {/* Online indicator */}
                  {isOwner && <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary-500 border-2 border-dark-card" />}
                </div>
                <div className="mb-1">
                  <h1 className="text-2xl font-black content-primary tracking-tight">{profile.name}</h1>
                  <p className="text-sm content-muted mt-0.5">{profile.bio}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 mb-1">
                <div className="flex items-center gap-1.5 text-sm content-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {formatDate(profile.joinDate)}</span>
                </div>
                {isOwner && (
                  <button
                    onClick={() => { setEditForm(profile); setShowEditModal(true) }}
                    className="btn-ghost text-xs py-2 px-4 gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="sep mb-6" />
            <div className="grid grid-cols-3 gap-6">
              {stats.map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="w-4 h-4" style={{ color }} />
                    <span className="text-2xl font-black content-primary">{value}</span>
                  </div>
                  <p className="text-xs content-muted uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1.5 card rounded-2xl w-fit">
          {tabs.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === id ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'content-muted hover:content-primary'
              }`}
            >
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === id ? 'bg-black/20 text-black' : 'surface-muted content-muted'}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Projects tab */}
        {activeTab === 'projects' && (
          <div>
            {userProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project, i) => (
                  <div key={project.id} className={`animate-fadeIn stagger-${(i % 6) + 1}`} style={{ opacity: 0 }}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card rounded-3xl p-16 text-center">
                <Code2 className="w-10 h-10 content-muted mx-auto mb-4 opacity-30" />
                <h3 className="text-base font-bold content-primary mb-2">No projects yet</h3>
                <p className="text-sm content-muted">This developer hasn't shared any projects yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          <div>
            {userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map(review => (
                  <div key={review.id} className="card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Link to={`/project/${review.projectId}`}
                        className="text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1.5">
                        View Project →
                      </Link>
                      <span className="text-xs content-muted">{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-white/10'}`} />
                      ))}
                    </div>
                    <p className="text-sm content-muted leading-relaxed">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card rounded-3xl p-16 text-center">
                <MessageSquare className="w-10 h-10 content-muted mx-auto mb-4 opacity-30" />
                <h3 className="text-base font-bold content-primary mb-2">No reviews written yet</h3>
                <p className="text-sm content-muted">This developer hasn't written any reviews yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        footer={
          <>
            <button onClick={() => setShowEditModal(false)} className="btn-ghost text-sm py-2 px-4">Cancel</button>
            <button onClick={handleSaveProfile} disabled={isSaving} className="btn-primary text-sm py-2 px-5 disabled:opacity-50">
              {isSaving ? 'Saving…' : 'Save Profile'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-2">Display Name</label>
            <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              className="input-premium" required />
          </div>
          <div>
            <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-2">Bio</label>
            <textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
              className="input-premium resize-none" rows={3} />
          </div>
          <div>
            <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-2">Photo URL</label>
            <input type="url" value={editForm.photoURL} onChange={e => setEditForm({ ...editForm, photoURL: e.target.value })}
              className="input-premium" />
          </div>
        </form>
      </Modal>
    </div>
  )
}