import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { addComment, subscribeToComments } from '../services/comments'
import type { Comment } from '../services/comments'

interface Props {
  productId: string
}

function timeAgo(ts: unknown): string {
  if (!ts) return ''
  // @ts-ignore
  const date = ts?.toDate ? ts.toDate() : new Date(ts)
  const diff  = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60)    return 'Just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function CommentSection({ productId }: Props) {
  const { user, isLoggedIn } = useAuth()
  const navigate             = useNavigate()
  const [comments, setComments] = useState<Comment[]>([])
  const [text,     setText]     = useState('')
  const [sending,  setSending]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = subscribeToComments(productId, setComments)
    return () => unsubscribe()
  }, [productId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  const handleSend = async () => {
    if (!text.trim()) return
    if (!isLoggedIn) { navigate('/login'); return }
    setSending(true)
    try {
      await addComment({
        productId,
        userId:   user!.uid,
        userName: user!.displayName ?? 'Anonymous',
        text:     text.trim(),
      })
      setText('')
    } finally {
      setSending(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div style={{ padding: '40px 0', fontFamily: 'Poppins, sans-serif' }}>

      {/* Title */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 24px' }}>
        Comments <span style={{ fontWeight: 400, color: '#888', fontSize: '16px' }}>({comments.length})</span>
      </h3>

      {/* List */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '16px',
        maxHeight: '400px', overflowY: 'auto',
        paddingRight: '4px', marginBottom: '24px',
      }}>
        {comments.length === 0 && (
          <p style={{ fontSize: '13.5px', color: '#aaa', textAlign: 'center', padding: '24px 0', margin: 0 }}>
            Be the first to comment on this product.
          </p>
        )}
        {comments.map(comment => (
          <div key={comment.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            {/* Avatar */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#0abfb8', color: '#fff', fontSize: '12px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {initials(comment.userName)}
            </div>
            {/* Body */}
            <div style={{
              flex: 1, borderRadius: '12px', padding: '10px 14px',
              background: comment.userId === user?.uid ? '#e6f9f4' : '#f5f5f5',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1a1a1a' }}>{comment.userName}</span>
                <span style={{ fontSize: '11px', color: '#aaa' }}>{timeAgo(comment.createdAt)}</span>
              </div>
              <p style={{ fontSize: '13.5px', color: '#333', margin: 0, lineHeight: 1.5, wordBreak: 'break-word' }}>
                {comment.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
        {isLoggedIn && (
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#0abfb8', color: '#fff', fontSize: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {initials(user?.displayName ?? '?')}
          </div>
        )}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px',
          border: '1.5px solid #e0e0e0', borderRadius: '20px', padding: '8px 8px 8px 16px',
        }}>
          <textarea
            placeholder={isLoggedIn ? 'Write a comment...' : 'Sign in to comment'}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            disabled={!isLoggedIn || sending}
            rows={1}
            style={{
              flex: 1, border: 'none', outline: 'none', resize: 'none',
              fontSize: '13.5px', fontFamily: 'Poppins, sans-serif',
              color: '#1a1a1a', background: 'transparent', lineHeight: 1.5,
              maxHeight: '100px', overflowY: 'auto',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!isLoggedIn || !text.trim() || sending}
            aria-label="Send comment"
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: '#0abfb8', color: '#fff', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: !isLoggedIn || !text.trim() || sending ? 'default' : 'pointer',
              flexShrink: 0, opacity: !isLoggedIn || !text.trim() || sending ? 0.4 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Login hint */}
      {!isLoggedIn && (
        <p style={{ fontSize: '12.5px', color: '#aaa', textAlign: 'center', margin: '12px 0 0' }}>
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#0abfb8', cursor: 'pointer', fontWeight: 600 }}
          >
            Sign in
          </span>{' '}
          to join the conversation.
        </p>
      )}
    </div>
  )
}