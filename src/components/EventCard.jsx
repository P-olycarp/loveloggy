import React from 'react'
import PropTypes from 'prop-types'

const moodMap = {
  love: { emoji: '❤️', className: 'bg-pink-50 text-pink-700' },
  neutral: { emoji: '😐', className: 'bg-gray-50 text-gray-700' },
  sad: { emoji: '😢', className: 'bg-blue-50 text-blue-700' },
  angry: { emoji: '😡', className: 'bg-red-50 text-red-700' },
}

function formatDate(dateInput) {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (Number.isNaN(d?.getTime())) return ''
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function EventCard({ title, date, mood = 'neutral', description, onClick, className = '' }) {
  const moodInfo = moodMap[mood] || moodMap['neutral']

  return (
    <article
      onClick={onClick}
      className={`max-w-md w-full rounded-lg border border-gray-100 shadow-sm overflow-hidden ${className}`}
      role={onClick ? 'button' : undefined}
    >
      <div className="p-4 flex items-start gap-4">
        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${moodInfo.className}`}>
          <span className="text-xl" aria-hidden>
            {moodInfo.emoji}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
            <time className="text-xs text-gray-500 ml-3">{formatDate(date)}</time>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        </div>
      </div>
    </article>
  )
}

EventCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  mood: PropTypes.oneOf(['love', 'neutral', 'sad', 'angry']),
  description: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
}
