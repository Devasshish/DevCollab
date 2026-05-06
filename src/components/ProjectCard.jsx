import { useNavigate, Link } from 'react-router-dom'
import { Github, ExternalLink, ChevronUp, Users, Bookmark, ArrowUpRight } from 'lucide-react'
import { memo, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'
import { doc, updateDoc, arrayUnion, arrayRemove, increment, setDoc, deleteDoc, getDoc } from 'firebase/firestore'

function ProjectCard({ project }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const hasUpvoted = user && project.upvotedBy?.includes(user.uid)

  useEffect(() => {
    if (!user) return
    const checkBookmark = async () => {
      const bRef = doc(db, 'bookmarks', `${user.uid}_${project.id}`)
      const snap = await getDoc(bRef)
      setIsBookmarked(snap.exists())
    }
    checkBookmark()
  }, [user, project.id])

  const handleUpvote = async (e) => {
    e.stopPropagation()
    if (!user) return
    const ref = doc(db, 'projects', project.id)
    if (hasUpvoted) {
      await updateDoc(ref, { upvotes: increment(-1), upvotedBy: arrayRemove(user.uid) })
    } else {
      await updateDoc(ref, { upvotes: increment(1), upvotedBy: arrayUnion(user.uid) })
    }
  }

  const handleBookmark = async (e) => {
    e.stopPropagation()
    if (!user) return
    const bRef = doc(db, 'bookmarks', `${user.uid}_${project.id}`)
    if (isBookmarked) {
      await deleteDoc(bRef)
      setIsBookmarked(false)
    } else {
      await setDoc(bRef, { userId: user.uid, projectId: project.id, savedAt: Date.now() })
      setIsBookmarked(true)
    }
  }

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer card-lift card"
    >
      {/* Hover glow border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(var(--primary-rgb-comma),0.2), 0 0 40px rgba(var(--primary-rgb-comma),0.04)' }} />

      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-dark-card">
        <img
          src={project.imageUrl || (project.demoLink
            ? `https://api.microlink.io/?url=${encodeURIComponent(project.demoLink)}&screenshot=true&meta=false&embed=screenshot.url`
            : 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800')}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Collab badge */}
        {project.lookingForCollab && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(var(--primary-rgb-comma),0.15)', border: '1px solid rgba(var(--primary-rgb-comma),0.35)', color: 'var(--primary)' }}>
            <Users className="w-3 h-3" /> Collab Open
          </div>
        )}

        {/* Top-right actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleBookmark}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isBookmarked
                ? 'bg-primary-500 text-black'
                : 'bg-black/50 backdrop-blur-sm content-muted hover:content-primary border border-[var(--card-border)]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Arrow on hover */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 text-black" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title + Upvote */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-bold content-primary group-hover:text-primary-500 transition-colors duration-300 line-clamp-2 leading-snug flex-1">
            {project.title}
          </h3>
          <button
            onClick={handleUpvote}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              hasUpvoted
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                : 'content-muted hover:text-primary-500 hover:bg-primary-500/10 border border-[var(--card-border)]'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
            <span>{project.upvotes || 0}</span>
          </button>
        </div>

        <p className="text-sm content-muted line-clamp-2 mb-4 leading-relaxed flex-1">
          {project.shortDesc}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 3).map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full content-faint border border-[var(--card-border)]">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--sep-color)]">
          <Link
            to={`/profile/${project.authorId}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-2 group/a hover:opacity-80 transition-opacity"
          >
            {project.authorPhoto ? (
              <img src={project.authorPhoto} alt={project.authorName || 'User'} className="w-7 h-7 rounded-full ring-1 ring-[var(--card-border)]" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black text-xs font-black">
                {(project.authorName || 'A')[0].toUpperCase()}
              </div>
            )}
            <span className="text-xs content-muted group-hover/a:content-primary transition-colors">
              {project.authorName || 'Anonymous'}
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-7 h-7 rounded-full flex items-center justify-center content-faint hover:content-primary hover:bg-[var(--surface-muted)] transition-all"
                title="View Code">
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-7 h-7 rounded-full flex items-center justify-center content-faint hover:text-primary-500 hover:bg-primary-500/10 transition-all"
                title="Live Demo">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ProjectCard)