import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, ArrowRight, Sparkles, Users, Zap, Star, Code2 } from 'lucide-react'
import ProjectCard from '../components/ProjectCard'
import SearchBar from '../components/SearchBar'
import FilterChip from '../components/FilterChip'
import Pagination from '../components/Pagination'
import { techStacks } from '../data/mockData'
import { db } from '../firebase/config'
import { collection, onSnapshot } from 'firebase/firestore'

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTech, setSelectedTech] = useState(null)
  const [sortBy, setSortBy] = useState('latest')
  const [showCollabOnly, setShowCollabOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [allProjects, setAllProjects] = useState([])
  const projectsPerPage = 6

  const statsRef = useReveal()
  const gridRef = useReveal()
  const filterRef = useReveal()

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      const projects = []
      snap.forEach(doc => projects.push({ id: doc.id, ...doc.data() }))
      setAllProjects(projects)
    })
    return () => unsub()
  }, [])

  const filteredProjects = useMemo(() => {
    let result = [...allProjects]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.techStack.some(t => t.toLowerCase().includes(q))
      )
    }
    if (selectedTech) result = result.filter(p => p.techStack.includes(selectedTech))
    if (showCollabOnly) result = result.filter(p => p.lookingForCollab)
    switch (sortBy) {
      case 'most-upvoted': result.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)); break
      case 'most-reviewed': result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)); break
      case 'highest-rated': result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)); break
      default: result.sort((a, b) => b.createdAt - a.createdAt)
    }
    return result
  }, [allProjects, searchQuery, selectedTech, sortBy, showCollabOnly])

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * projectsPerPage
    return filteredProjects.slice(start, start + projectsPerPage)
  }, [filteredProjects, currentPage])

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)

  const handleTechFilter = (tech) => {
    setSelectedTech(selectedTech === tech ? null : tech)
    setCurrentPage(1)
  }

  const stats = [
    { icon: Code2, value: `${allProjects.length}+`, label: 'Projects', color: 'text-primary-400' },
    { icon: Users, value: '100%', label: 'Open Source', color: 'text-purple-400' },
    { icon: Star, value: '5★', label: 'Community Rated', color: 'text-yellow-400' },
    { icon: Zap, value: 'Live', label: 'Real-time Updates', color: 'text-blue-400' },
  ]

  return (
    <div className="min-h-screen page-bg">

      {/* ─── Hero ───────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient orbs */}
        <div className="orb w-[600px] h-[600px] orb-primary opacity-[0.08] top-[-100px] left-[-200px] animate-float-slow" style={{background:'radial-gradient(circle,var(--primary),transparent)'}} />
        <div className="orb w-[500px] h-[500px] opacity-[0.06] bottom-[-100px] right-[-150px] animate-float" style={{background:'radial-gradient(circle,#a855f7,transparent)'}} />
        <div className="orb w-[300px] h-[300px] opacity-[0.05] top-[40%] right-[25%]" style={{background:'radial-gradient(circle,#3b82f6,transparent)'}} />

        {/* Marquee background text */}
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none opacity-[0.03]">
          <div className="inline-block animate-marquee whitespace-nowrap text-[20vw] font-black content-primary leading-none">
            DEVCOLLAB&nbsp;•&nbsp;BUILD&nbsp;•&nbsp;SHIP&nbsp;•&nbsp;INSPIRE&nbsp;•&nbsp;DEVCOLLAB&nbsp;•&nbsp;BUILD&nbsp;•&nbsp;SHIP&nbsp;•&nbsp;INSPIRE&nbsp;•&nbsp;
          </div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(var(--text) 1px,transparent 1px),linear-gradient(90deg,var(--text) 1px,transparent 1px)',backgroundSize:'80px 80px'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20 mb-8 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-xs font-semibold content-primary uppercase tracking-widest">Developer Showcase Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(3rem,12vw,9rem)] font-black leading-[0.88] tracking-tight mb-8 animate-fadeIn stagger-1" style={{opacity:0}}>
            <span className="block content-primary">Craft.</span>
            <span className="block gradient-text text-glow">Collab.</span>
            <span className="block content-primary">Conquer.</span>
          </h1>

          <p className="text-base md:text-lg content-muted max-w-lg mx-auto leading-relaxed mb-10 animate-fadeIn stagger-2" style={{opacity:0}}>
            The premier showcase for developers to share projects, collect peer reviews, and find collaborators.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-fadeIn stagger-3" style={{opacity:0}}>
            <a href="#projects" className="btn-primary gap-2 px-7 py-3.5 text-sm">
              Explore Projects <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#projects" className="btn-ghost gap-2 px-7 py-3.5 text-sm">
              Browse All
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] content-muted">Scroll</span>
          <div className="w-[1px] h-12 surface-muted relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary-500 animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </section>

      {/* ─── Stats ──────────────────────────────────── */}
      <section ref={statsRef} className="reveal py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, value, label, color }, i) => (
              <div key={label} className={`glass rounded-2xl p-6 text-center card-lift stagger-${i + 1}`}>
                <Icon className={`w-6 h-6 ${color} mx-auto mb-3 opacity-80`} />
                <div className="text-3xl font-black content-primary mb-1">{value}</div>
                <div className="text-xs content-faint uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Filter bar ─────────────────────────────── */}
      <section id="projects" ref={filterRef} className="reveal py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-6 border border-white/5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
              <div className="flex-1 max-w-xl">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search projects or technologies…" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-full glass border border-[var(--card-border)] cursor-pointer hover:border-primary-500/30 transition-all text-sm font-medium content-muted">
                  <input
                    type="checkbox"
                    checked={showCollabOnly}
                    onChange={e => { setShowCollabOnly(e.target.checked); setCurrentPage(1) }}
                    className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
                  />
                  <Users className="w-3.5 h-3.5 text-primary-400" />
                  <span>Collab Only</span>
                </label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="input-premium rounded-full py-2.5 px-4 text-sm cursor-pointer min-w-[150px]"
                >
                  <option value="latest">Latest</option>
                  <option value="most-upvoted">Most Upvoted</option>
                  <option value="most-reviewed">Most Reviewed</option>
                  <option value="highest-rated">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="sep mb-4" />

            <div className="flex flex-wrap gap-2">
              {techStacks.slice(0, 12).map(tech => (
                <FilterChip
                  key={tech}
                  label={tech}
                  active={selectedTech === tech}
                  onClick={() => handleTechFilter(tech)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Projects Grid ──────────────────────────── */}
      <section ref={gridRef} className="reveal pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {paginatedProjects.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm content-faint">
                  Showing <span className="content-primary font-semibold">{paginatedProjects.length}</span> of{' '}
                  <span className="content-primary font-semibold">{filteredProjects.length}</span> projects
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProjects.map((project, index) => (
                  <div key={project.id} className={`animate-fadeIn stagger-${(index % 6) + 1}`} style={{ opacity: 0 }}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-14">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-28">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-5">
                <Search className="w-7 h-7 content-faint" />
              </div>
              <h3 className="text-lg font-bold content-primary mb-2">No projects found</h3>
              <p className="content-muted text-sm mb-6">Try adjusting your search or filter</p>
              {(searchQuery || selectedTech || showCollabOnly) && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTech(null); setShowCollabOnly(false); setCurrentPage(1) }}
                  className="btn-ghost text-sm px-5 py-2"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}