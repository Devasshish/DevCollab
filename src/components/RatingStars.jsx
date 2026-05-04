import { Star } from 'lucide-react'
import { useState } from 'react'

export default function RatingStars({ rating, onRatingChange, readonly = false, size = 'md' }) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (value) => {
    if (!readonly && onRatingChange) onRatingChange(value)
  }

  const handleMouseEnter = (value) => {
    if (!readonly) setHoverRating(value)
  }

  const handleMouseLeave = () => setHoverRating(0)

  const displayRating = hoverRating || rating

  return (
    <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'} transition-all duration-200`}
        >
          <Star
            className={`${sizeClasses[size]} transition-all duration-300 ${
              star <= displayRating 
                ? 'text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' 
                : 'content-faint opacity-20'
            }`}
          />
        </button>
      ))}
    </div>
  )
}