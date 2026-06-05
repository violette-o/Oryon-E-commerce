import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { submitRating, getRatings, getAverage } from '../services/ratings'
import type { Rating } from '../services/ratings'

interface Props {
  productId: string
}

function StarIcon({ filled, size = 18 }: { filled: boolean; size?: number }) {
  return (
    <Star
      size={size}
      fill={filled ? '#f5a623' : 'none'}
      stroke={filled ? '#f5a623' : '#ccc'}
      strokeWidth={1.5}
    />
  )
}

function StarRow({ value, onChange, readonly = false }: {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
  size?: number
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          style={{ cursor: readonly ? 'default' : 'pointer', display: 'flex' }}
          onClick={() => !readonly && onChange?.(i)}
          onMouseEnter={() => !readonly && setHovered(i)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          <StarIcon filled={i <= (hovered || value)} />
        </span>
      ))}
    </div>
  )
}

export default function RatingSection({ productId }: Props) {
  const { user, isLoggedIn } = useAuth()
  const navigate             = useNavigate()

  const [ratings,  setRatings]  = useState<Rating[]>([])
  const [loading,  setLoading]  = useState(true)
  const [stars,    setStars]    = useState(0)
  const [review,   setReview]   = useState('')
  const [sending,  setSending]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  const load = () => {
    getRatings(productId).then(data => {
      setRatings(data)
      setLoading(false)
      // Pre-fill si el usuario ya dejó rating
      if (user) {
        const mine = data.find(r => r.userId === user.uid)
        if (mine) { setStars(mine.stars); setReview(mine.review) }
      }
    })
  }

  useEffect(() => { load() }, [productId])

  const handleSubmit = async () => {
    if (!isLoggedIn) { navigate('/login'); return }
    if (stars === 0) return
    setSending(true)
    try {
      await submitRating({
        productId,
        userId:   user!.uid,
        userName: user!.displayName ?? 'Anonymous',
        stars,
        review,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
      load()
    } finally {
      setSending(false)
    }
  }

  const average = getAverage(ratings)

  return (
    <div style={{ padding: '40px 0', fontFamily: 'Poppins, sans-serif' }}>

      {/* Toast */}
      {success && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 999,
          background: '#0abfb8', color: '#fff', padding: '12px 24px',
          borderRadius: '12px', fontSize: '13px', fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          ✓ Rating submitted!
        </div>
      )}

      {/* Header */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 24px' }}>
        Ratings & Reviews <span style={{ fontWeight: 400, color: '#888', fontSize: '16px' }}>({ratings.length})</span>
      </h3>

      {/* Summary */}
      {!loading && ratings.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '20px',
          background: '#f9f9f9', borderRadius: '16px', padding: '20px 24px',
          marginBottom: '28px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{average}</div>
            <StarRow value={Math.round(average)} readonly />
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{ratings.length} reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratings.filter(r => r.stars === star).length
              const pct   = ratings.length > 0 ? (count / ratings.length) * 100 : 0
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#555', width: '8px' }}>{star}</span>
                  <Star size={12} fill="#f5a623" stroke="#f5a623" />
                  <div style={{ flex: 1, height: '6px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#f5a623', borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#888', width: '20px' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {loading && <p style={{ color: '#aaa', fontSize: '13.5px', textAlign: 'center' }}>Loading reviews...</p>}
        {!loading && ratings.length === 0 && (
          <p style={{ color: '#aaa', fontSize: '13.5px', textAlign: 'center', padding: '16px 0' }}>
            No reviews yet. Be the first to rate this product!
          </p>
        )}
        {ratings.map(rating => (
          <div key={rating.id} style={{
            border: '1px solid #f0f0f0', borderRadius: '14px', padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{rating.userName}</p>
                <StarRow value={rating.stars} readonly size={14} />
              </div>
              {rating.userId === user?.uid && (
                <span style={{ fontSize: '11px', color: '#0abfb8', fontWeight: 600 }}>Your review</span>
              )}
            </div>
            {rating.review && (
              <p style={{ fontSize: '13.5px', color: '#555', margin: '8px 0 0', lineHeight: 1.6 }}>{rating.review}</p>
            )}
          </div>
        ))}
      </div>

      {/* Submit form */}
      <div style={{
        border: '1.5px solid #e0e0e0', borderRadius: '16px', padding: '24px',
      }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>
          {isLoggedIn ? 'Leave a Review' : 'Sign in to leave a review'}
        </h4>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#888', margin: '0 0 8px', letterSpacing: '0.3px' }}>YOUR RATING</p>
          <StarRow value={stars} onChange={setStars} />
        </div>

        <textarea
          placeholder="Share your experience with this product (optional)"
          value={review}
          onChange={e => setReview(e.target.value)}
          disabled={!isLoggedIn || sending}
          rows={3}
          style={{
            width: '100%', border: '1.5px solid #e0e0e0', borderRadius: '10px',
            padding: '11px 14px', fontSize: '13px', fontFamily: 'Poppins, sans-serif',
            color: '#1a1a1a', outline: 'none', resize: 'none',
            boxSizing: 'border-box', transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#0abfb8')}
          onBlur={e  => (e.currentTarget.style.borderColor = '#e0e0e0')}
        />

        <button
          onClick={isLoggedIn ? handleSubmit : () => navigate('/login')}
          disabled={isLoggedIn && (stars === 0 || sending)}
          style={{
            marginTop: '12px',
            background: '#0abfb8', color: '#fff', border: 'none',
            borderRadius: '20px', padding: '11px 28px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            opacity: isLoggedIn && (stars === 0 || sending) ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {!isLoggedIn ? 'Sign in to Review' : sending ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  )
}