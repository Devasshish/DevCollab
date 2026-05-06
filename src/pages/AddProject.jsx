import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { techStacks } from '../data/mockData'
import { db } from '../firebase/config'
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore'
import { ArrowLeft, Rocket, Plus, X, Globe, Github, Image as ImageIcon, Users, AlertCircle } from 'lucide-react'

export default function AddProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    fullDesc: '',
    techStack: [],
    githubLink: '',
    demoLink: '',
    imageUrl: '',
    lookingForCollab: false,
    collabRoles: ''
  })

  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        const docRef = doc(db, 'projects', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setFormData(docSnap.data())
        }
      }
      fetchProject()
    }
  }, [id, isEditing])

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [techInput, setTechInput] = useState('')

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.shortDesc.trim()) newErrors.shortDesc = 'Short description is required'
    else if (formData.shortDesc.trim().length < 20) newErrors.shortDesc = 'Too short (min 20)'
    if (!formData.fullDesc.trim()) newErrors.fullDesc = 'Full description is required'
    else if (formData.fullDesc.trim().length < 50) newErrors.fullDesc = 'Too short (min 50)'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTechStackChange = (tech) => {
    if (formData.techStack.includes(tech)) {
      setFormData({ ...formData, techStack: formData.techStack.filter((t) => t !== tech) })
    } else {
      setFormData({ ...formData, techStack: [...formData.techStack, tech] })
    }
  }

  const handleAddCustomTech = () => {
    const tech = techInput.trim()
    if (tech && !formData.techStack.includes(tech)) {
      setFormData({ ...formData, techStack: [...formData.techStack, tech] })
      setTechInput('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'projects', id), { ...formData, updatedAt: Date.now() })
      } else {
        await addDoc(collection(db, 'projects'), {
          ...formData,
          authorId: user.uid,
          authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          authorPhoto: user.photoURL || '',
          createdAt: Date.now(),
          averageRating: 0,
          reviewCount: 0,
          upvotes: 0,
          upvotedBy: []
        })
      }
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      setErrors({ submit: 'Failed to save project.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen page-bg py-12 relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="orb w-[600px] h-[600px] -top-40 -left-40 opacity-[0.05]" style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
      <div className="orb w-[400px] h-[400px] top-1/2 -right-20 opacity-[0.03]" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm content-muted hover:text-primary-400 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="card rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Rocket className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-black content-primary tracking-tight">
                {isEditing ? 'Refine Project' : 'Launch Project'}
              </h1>
              <p className="text-sm content-muted">Share your creation with the developer community.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-3">Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Neo-Task Management System"
                  className="input-premium py-4"
                />
                {errors.title && <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-3">Short Hook</label>
                <textarea
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="The 1-sentence 'why' behind your project..."
                  rows={2}
                  className="input-premium py-4 resize-none"
                />
                {errors.shortDesc && <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.shortDesc}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-3">Project Story</label>
                <textarea
                  value={formData.fullDesc}
                  onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                  placeholder="Describe the problem, the solution, and the tech behind it..."
                  rows={6}
                  className="input-premium py-4 resize-none"
                />
                {errors.fullDesc && <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.fullDesc}</p>}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-3">Technologies Used</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.techStack.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleTechStackChange(tech)}
                    className="tech-tag pr-2 flex items-center gap-1.5"
                  >
                    {tech} <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {techStacks.slice(0, 12).map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleTechStackChange(tech)}
                    disabled={formData.techStack.includes(tech)}
                    className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${
                      formData.techStack.includes(tech) 
                        ? 'opacity-20 cursor-not-allowed' 
                        : 'content-muted border-white/10 hover:border-primary-500/50 hover:text-primary-400'
                    }`}
                  >
                    + {tech}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTech())}
                  placeholder="Something else?"
                  className="flex-1 input-premium py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTech}
                  className="btn-ghost py-2 px-4 text-xs"
                >
                  Add Custom
                </button>
              </div>
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-3">GitHub Repository</label>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 content-faint" />
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    placeholder="https://github.com/..."
                    className="input-premium pl-11 py-3.5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-3">Live Demo URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 content-faint" />
                  <input
                    type="url"
                    value={formData.demoLink}
                    onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                    placeholder="https://yourapp.com"
                    className="input-premium pl-11 py-3.5"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold content-muted uppercase tracking-widest mb-3">Cover Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 content-faint" />
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://unsplash.com/..."
                  className="input-premium pl-11 py-3.5"
                />
              </div>
            </div>

            {/* Collaboration */}
            <div className="p-6 rounded-3xl surface-muted border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-400" />
                  <div>
                    <h3 className="text-sm font-bold content-primary">Seeking Collaborators</h3>
                    <p className="text-xs content-muted">Allow others to join your project team.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, lookingForCollab: !formData.lookingForCollab })}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.lookingForCollab ? 'bg-primary-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.lookingForCollab ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              
              {formData.lookingForCollab && (
                <div className="animate-fadeIn">
                  <input
                    type="text"
                    value={formData.collabRoles || ''}
                    onChange={(e) => setFormData({ ...formData, collabRoles: e.target.value })}
                    placeholder="e.g. Need a Backend Wizard (Node.js/Redis)"
                    className="input-premium py-3 text-xs"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 py-4 gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Rocket className="w-4 h-4" />
                )}
                {isEditing ? 'Save Changes' : 'Launch Project'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-ghost flex-1 py-4"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}