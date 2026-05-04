import { Star, Trash2 } from 'lucide-react'
import { memo } from 'react'
import { useAuth } from '../contexts/AuthContext'

function ReviewCard({ review, onEdit, onDelete }) {
  const { user } = useAuth()
  const isOwner = user?.uid === review.userId

  const formatDate = ts => new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="card rounded-2xl p-5 card-lift">
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Author */}
        <div className="flex items-center gap-3">
          {review.userPhoto ? (
            <img src={review.userPhoto} alt={review.userName} className="w-9 h-9 rounded-xl ring-1" style={{ ringColor: 'var(--card-border)' }} />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black font-black text-sm">
              {review.userName[0]}
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold content-primary">{review.userName}</h4>
            <p className="text-xs content-faint">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'content-faint opacity-20'}`} />
          ))}
        </div>
      </div>

      <p className="text-sm content-muted leading-relaxed">{review.reviewText}</p>

      {isOwner && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderTopColor: 'var(--sep-color)' }}>
          {onEdit && (
            <button onClick={() => onEdit(review)}
              className="text-xs font-bold text-primary-400 hover:text-primary-300 px-3 py-1.5 rounded-xl hover:bg-primary-500/10 transition-all">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(review.id)}
              className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-all flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(ReviewCard)