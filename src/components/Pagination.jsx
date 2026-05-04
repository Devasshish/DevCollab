import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const max = 5
  let start = Math.max(1, currentPage - Math.floor(max / 2))
  let end = Math.min(totalPages, start + max - 1)
  if (end - start + 1 < max) start = Math.max(1, end - max + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  const base = 'w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200'
  const inactive = `${base} content-muted hover:content-primary hover:bg-primary-500/10 border`
  const active = `${base} bg-primary-500 text-black shadow-lg shadow-primary-500/25`
  const nav = `${base} content-faint hover:content-primary hover:bg-primary-500/10 border disabled:opacity-20 disabled:cursor-not-allowed`

  const borderStyle = { borderColor: 'var(--card-border)' }

  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={nav} style={borderStyle}>
        <ChevronLeft className="w-4 h-4" />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={inactive} style={borderStyle}>1</button>
          {start > 2 && <span className="content-faint px-1 opacity-30">…</span>}
        </>
      )}

      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)} className={page === currentPage ? active : inactive} 
          style={page === currentPage ? {} : borderStyle}>
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="content-faint px-1 opacity-30">…</span>}
          <button onClick={() => onPageChange(totalPages)} className={inactive} style={borderStyle}>{totalPages}</button>
        </>
      )}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={nav} style={borderStyle}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}