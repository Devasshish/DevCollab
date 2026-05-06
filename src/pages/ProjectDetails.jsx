import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Github, ExternalLink, Calendar, User, Edit, Trash2, ArrowLeft, Star, MessageSquare, ChevronUp, Bookmark, Users, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'
import { doc, getDoc, deleteDoc, collection, addDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove, increment, setDoc } from 'firebase/firestore'
import ReviewCard from '../components/ReviewCard'
import RatingStars from '../components/RatingStars'
import Modal from '../components/Modal'

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newReview, setNewReview] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(doc(db, 'projects', id), (snap) => {
      if (snap.exists()) setProject({ id: snap.id, ...snap.data() })
      else setProject(null)
      setLoading(false)
    }, (error) => {
      console.error(error)
      setLoading(false)
    })
    return () => unsub()
  }, [id])

  useEffect(() => {
    if (!user || !project) return
    const check = async () => {
      const snap = await getDoc(doc(db, 'bookmarks', `${user.uid}_${project.id}`))
      setIsBookmarked(snap.exists())
    }
    check()
  }, [user, project])

  useEffect(() => {
    if (!id) return
    const q = query(collection(db, 'reviews'), where('projectId', '==', id))
    const unsub = onSnapshot(q, snap => {
      const r = []
      snap.forEach(d => r.push({ id: d.id, ...d.data() }))
      r.sort((a, b) => b.createdAt - a.createdAt)
      setReviews(r)
    })
    return () => unsub()
  }, [id])

  const hasUpvoted = user && project?.upvotedBy?.includes(user.uid)
  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    return reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
  }, [reviews])
  const isOwner = user?.uid === project?.authorId
  const formatDate = ts => new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const handleUpvote = async () => {
    if (!user) return
    const ref = doc(db, 'projects', project.id)
    if (hasUpvoted) await updateDoc(ref, { upvotes: increment(-1), upvotedBy: arrayRemove(user.uid) })
    else await updateDoc(ref, { upvotes: increment(1), upvotedBy: arrayUnion(user.uid) })
  }

  const handleBookmark = async () => {
    if (!user) return
    const bRef = doc(db, 'bookmarks', `${user.uid}_${project.id}`)
    if (isBookmarked) { await deleteDoc(bRef); setIsBookmarked(false) }
    else { await setDoc(bRef, { userId: user.uid, projectId: project.id, savedAt: Date.now() }); setIsBookmarked(true) }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user || !newReview.trim() || rating === 0) return
    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'reviews'), {
        projectId: project.id, userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userPhoto: user.photoURL || '', rating, reviewText: newReview, createdAt: Date.now()
      })
      setNewReview(''); setRating(0)
    } catch (e) { console.error(e) }
    finally { setIsSubmitting(false) }
  }

  const handleDeleteReview = async (reviewId) => {
    try { await deleteDoc(doc(db, 'reviews', reviewId)) } catch (e) { console.error(e) }
  }

  const handleDeleteProject = async () => {
    try { await deleteDoc(doc(db, 'projects', project.id)); navigate('/dashboard') } catch (e) { console.error(e) }
  }

  if (loading) return (
    <div className="min-h-screen page-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )

  if (!project) return (
    <div className="min-h-screen page-bg flex items-center justify-center text-center">
      <div>
        <AlertCircle className="w-12 h-12 content-faint mx-auto mb-4" />
        <h1 className="text-xl font-bold content-primary mb-3">Project not found</h1>
        <Link to="/" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">← Go back home</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen page-bg py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm content-muted hover:text-primary-500 transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to projects
        </Link>

        {/* Main card */}
        <div className="glass rounded-3xl overflow-hidden mb-8">
          {/* Hero image */}
          <div className="relative aspect-[21/9] w-full surface-muted overflow-hidden">
            <img
              src={project.imageUrl || (project.demoLink ? `https://api.microlink.io/?url=${encodeURIComponent(project.demoLink)}&screenshot=true&meta=false&embed=screenshot.url` : 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200')}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Tech pills on image */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {project.techStack.slice(0, 4).map(tech => (
                <span key={tech} className="tech-tag shadow-lg backdrop-blur-md !border-white/20 !text-white !bg-black/50">
                  {tech}
                </span>
              ))}
            </div>

            {/* Bookmark */}
            <button onClick={handleBookmark}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isBookmarked ? 'bg-primary-500 text-black' : 'backdrop-blur-md bg-black/40 text-white hover:bg-black/60 border border-white/20'}`}>
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-7">
            {/* Collab banner */}
            {project.lookingForCollab && (
              <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 bg-primary-500/5 border border-primary-500/20">
                <Users className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-primary-600 dark:text-primary-400">Seeking Collaborators</p>
                  <p className="text-xs content-muted mt-0.5">{project.collabRoles || 'Looking for developers to join the team!'}</p>
                </div>
              </div>
            )}

            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div className="flex-1">
                <h1 className="text-3xl font-black content-primary tracking-tight mb-3">{project.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm content-muted">
                  <Link to={`/profile/${project.authorId}`} className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                    {project.authorPhoto
                      ? <img src={project.authorPhoto} alt={project.authorName} className="w-5 h-5 rounded-full" />
                      : <User className="w-4 h-4" />}
                    {project.authorName || 'Anonymous'}
                  </Link>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />{formatDate(project.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={handleUpvote}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${hasUpvoted ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/40' : 'content-muted hover:text-primary-500 hover:bg-primary-500/10 border border-[var(--card-border)]'}`}>
                  <ChevronUp className="w-5 h-5" />
                  <span>{project.upvotes || 0}</span>
                </button>
                {isOwner && (
                  <>
                    <Link to={`/edit/${project.id}`}
                      className="w-9 h-9 rounded-xl flex items-center justify-center content-faint hover:content-primary hover:bg-primary-500/10 border border-[var(--card-border)] transition-all">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setShowDeleteModal(true)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center content-faint hover:text-red-500 hover:bg-red-500/10 border border-[var(--card-border)] transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Rating bar */}
            <div className="flex items-center gap-4 p-4 rounded-2xl mb-6 surface-muted border border-[var(--card-border)]">
              <RatingStars rating={Math.round(averageRating)} readonly size="lg" />
              <span className="text-xl font-black content-primary">{averageRating.toFixed(1)}</span>
              <span className="text-sm content-muted flex items-center gap-1.5"><MessageSquare className="w-4 h-4" />{reviews.length} reviews</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 mb-7">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                  className="btn-ghost py-2.5 hover:-translate-y-0.5">
                  <Github className="w-4 h-4" /> View Code
                </a>
              )}
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer"
                  className="btn-primary gap-2 py-2.5 px-5 text-sm hover:-translate-y-0.5">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-bold content-faint uppercase tracking-widest mb-3">About this project</h2>
              <p className="content-muted leading-relaxed text-sm whitespace-pre-wrap">{project.fullDesc}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-black content-primary tracking-tight mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" /> Reviews
          </h2>

          {user ? (
            <form onSubmit={handleSubmitReview} className="glass rounded-3xl p-6 mb-6">
              <h3 className="text-sm font-bold content-primary mb-4">Write a review</h3>
              <div className="mb-4">
                <label className="block text-xs font-semibold content-faint uppercase tracking-widest mb-2">Rating</label>
                <RatingStars rating={rating} onRatingChange={setRating} size="lg" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold content-faint uppercase tracking-widest mb-2">Your review</label>
                <textarea
                  value={newReview}
                  onChange={e => setNewReview(e.target.value)}
                  placeholder="Share your thoughts about this project…"
                  rows={4}
                  className="input-premium rounded-2xl resize-none"
                  required
                />
              </div>
              <button type="submit" disabled={isSubmitting || rating === 0 || !newReview.trim()}
                className="btn-primary text-sm py-2.5 px-6 gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                {isSubmitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="glass rounded-3xl p-8 mb-6 text-center">
              <Star className="w-8 h-8 content-faint opacity-50 mx-auto mb-3" />
              <p className="text-sm content-muted">
                <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">Sign in</Link> to write a review
              </p>
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => <ReviewCard key={review.id} review={review} onDelete={handleDeleteReview} />)}
            </div>
          ) : (
            <div className="glass rounded-3xl p-12 text-center">
              <MessageSquare className="w-8 h-8 content-faint opacity-50 mx-auto mb-3" />
              <p className="text-sm content-muted">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Project"
          footer={
            <>
              <button onClick={() => setShowDeleteModal(false)} className="btn-ghost text-sm py-2 px-4">Cancel</button>
              <button onClick={handleDeleteProject} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-bold">Delete</button>
            </>
          }
        >
          <p className="text-sm content-muted">Are you sure you want to delete "{project.title}"? This action cannot be undone.</p>
        </Modal>
      </div>
    </div>
  )
}