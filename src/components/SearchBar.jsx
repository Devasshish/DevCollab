import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from '../hooks/useHooks'

export default function SearchBar({ value, onChange, placeholder = 'Search projects...' }) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, 300)

  useEffect(() => { onChange(debouncedValue) }, [debouncedValue, onChange])
  useEffect(() => { setLocalValue(value) }, [value])

  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-primary-400 transition-colors duration-200" />
      <input
        type="text"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="input-premium pl-11 pr-10 py-3 rounded-2xl"
      />
      {localValue && (
        <button
          onClick={() => { setLocalValue(''); onChange('') }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}