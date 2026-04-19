'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useNotification } from './NotificationProvider'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export function StarRating({ rating, onRate, interactive = false, size = 'md' }) {
  const [hover, setHover] = useState(0)
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${sizeClasses[size]} transition-colors`}
        >
          <svg
            className={`${
              star <= (hover || rating) ? 'text-yellow-400' : 'text-zinc-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ productId }) {
  const { user, isAuthenticated } = useAuth()
  const { success, error } = useNotification()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/reviews?product_id=eq.${productId}&is_approved=true&order=created_at.desc&limit=10`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const data = await res.json()
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async () => {
    if (!isAuthenticated) {
      error('Please login to leave a review')
      return
    }
    if (newReview.rating === 0) {
      error('Please select a rating')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          product_id: productId,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment,
          is_approved: false
        })
      })

      if (res.ok) {
        success('Review submitted! It will appear after approval.')
        setShowForm(false)
        setNewReview({ rating: 0, comment: '' })
      } else {
        error('Failed to submit review')
      }
    } catch (err) {
      error('Error submitting review')
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) return null

  return (
    <div className="mt-8 pt-8 border-t border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Reviews</h3>
          <div className="flex items-center gap-3 mt-1">
            <StarRating rating={Math.round(avgRating)} size="sm" />
            <span className="text-zinc-400 text-sm">
              {avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Write Review
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Your Rating</label>
            <StarRating
              rating={newReview.rating}
              onRate={(r) => setNewReview({ ...newReview, rating: r })}
              interactive
              size="lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              rows={3}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={submitReview}
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-zinc-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-zinc-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-zinc-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-zinc-300 text-sm">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}