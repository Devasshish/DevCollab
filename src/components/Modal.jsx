import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass-md rounded-3xl w-full max-w-md animate-fadeIn border"
        style={{ 
          borderColor: 'var(--card-border)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--card-border)' 
        }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderBottomColor: 'var(--sep-color)' }}>
          <h3 className="text-base font-bold content-primary">{title}</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center content-faint hover:content-primary hover:bg-primary-500/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-5 border-t" style={{ borderTopColor: 'var(--sep-color)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}