export default function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
        active
          ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/25'
          : 'text-white/45 hover:text-white/75 border border-white/8 hover:border-white/15'
      }`}
      style={active ? {} : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {label}
    </button>
  )
}