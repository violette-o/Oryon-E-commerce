import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoClaro from '../assets/Logo Oryon claro.png'

function Constellation() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 1440 820"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="80"  y1="120" x2="200" y2="80"  stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="200" y1="80"  x2="340" y2="160" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="340" y1="160" x2="260" y2="300" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="260" y1="300" x2="80"  y2="380" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="80"  y1="380" x2="140" y2="500" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="140" y1="500" x2="80"  y2="600" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="120" y1="460" x2="240" y2="480" stroke="rgba(255,255,255,0.20)" strokeWidth="1" />
      <line x1="50"  y1="280" x2="130" y2="260" stroke="rgba(255,255,255,0.20)" strokeWidth="1" />
      {[[80,120],[200,80],[340,160],[260,300],[80,380],[140,500],[80,600],[120,460],[240,480],[50,280],[130,260]].map(([cx,cy],i) => (
        <circle key={`l${i}`} cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.5)" />
      ))}
      <line x1="1100" y1="80"  x2="1260" y2="140" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1260" y1="140" x2="1380" y2="100" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1380" y1="100" x2="1360" y2="240" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1360" y1="240" x2="1200" y2="300" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1200" y1="300" x2="1100" y2="420" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1100" y1="420" x2="1300" y2="480" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1300" y1="480" x2="1380" y2="400" stroke="rgba(255,255,255,0.20)" strokeWidth="1" />
      {[[1100,80],[1260,140],[1380,100],[1360,240],[1200,300],[1100,420],[1300,480],[1380,400]].map(([cx,cy],i) => (
        <circle key={`r${i}`} cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.5)" />
      ))}
      {[[420,60],[500,200],[160,640],[320,700],[1050,600],[1200,680],[900,720],[600,740]].map(([cx,cy],i) => (
        <circle key={`s${i}`} cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.3)" />
      ))}
    </svg>
  )
}

function IconInput({ icon, type = 'text', placeholder, value, onChange }: {
  icon: React.ReactNode; type?: string; placeholder: string
  value: string; onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      border: `1.5px solid ${focused ? '#8ecfc9' : 'rgba(255,255,255,0.25)'}`,
      borderRadius: '30px', padding: '13px 20px',
      background: 'rgba(255,255,255,0.05)', transition: 'border-color 0.2s',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', flexShrink: 0 }}>{icon}</span>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: '#fff', fontSize: '14px', fontFamily: 'Poppins, sans-serif',
        }}
      />
    </div>
  )
}

function parseFirebaseError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':        return 'Invalid email address.'
    case 'auth/user-not-found':       return 'No account found with this email.'
    case 'auth/wrong-password':       return 'Incorrect password.'
    case 'auth/email-already-in-use': return 'This email is already registered.'
    case 'auth/weak-password':        return 'Password must be at least 6 characters.'
    case 'auth/too-many-requests':    return 'Too many attempts. Please try again later.'
    case 'auth/invalid-credential':   return 'Invalid email or password.'
    default:                          return 'Something went wrong. Please try again.'
  }
}

export default function Login() {
  const { login, register, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [mode,        setMode]       = useState<'login' | 'register' | 'forgot'>('login')
  const [name,        setName]       = useState('')
  const [email,       setEmail]      = useState('')
  const [password,    setPass]       = useState('')
  const [confirm,     setConfirm]    = useState('')
  const [error,       setError]      = useState('')
  const [message,     setMessage]    = useState('')
  const [loading,     setLoading]    = useState(false)

  const switchMode = (m: typeof mode) => {
    setMode(m); setError(''); setMessage('')
    setName(''); setEmail(''); setPass(''); setConfirm('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setMessage('')

    if (mode === 'forgot') {
      if (!email) { setError('Please enter your email.'); return }
      setLoading(true)
      try {
        await resetPassword(email)
        setMessage('Password reset email sent! Check your inbox.')
      } catch (err: unknown) {
        const code = (err as { code?: string }).code ?? ''
        setError(parseFirebaseError(code))
      } finally {
        setLoading(false)
      }
      return
    }

    if (mode === 'register') {
      if (!name.trim())        { setError('Please enter your name.'); return }
      if (password !== confirm) { setError('Passwords do not match.'); return }
      if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }
    }

    setLoading(true)
    try {
      if (mode === 'login') { await login(email, password) }
      else                  { await register(name, email, password) }
      navigate('/')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(parseFirebaseError(code))
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = {
    width: '100%', maxWidth: '640px',
    background: '#4a4a4a', borderRadius: '28px',
    border: '1.5px solid rgba(142,207,201,0.5)',
    padding: '40px 60px 36px',
    boxShadow: '0 0 40px rgba(10,191,184,0.1)',
    zIndex: 2, position: 'relative' as const,
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#3a3a3a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Poppins, sans-serif',
      position: 'relative', overflow: 'hidden', padding: '40px 24px',
    }}>
      <Constellation />

      <button onClick={() => navigate('/')} style={{
        position: 'absolute', top: '28px', left: '32px',
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#fff', fontSize: '22px', zIndex: 2,
      }}>←</button>

      <div style={{ textAlign: 'center', marginBottom: '32px', zIndex: 2, position: 'relative' }}>
        <p style={{ color: '#fff', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>Welcome to</p>
        <img src={logoClaro} alt="Oryon" style={{ height: '80px', objectFit: 'contain' }} />
      </div>

      <div style={cardStyle}>

        {/* ── FORGOT PASSWORD ── */}
        {mode === 'forgot' && (
          <>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 600, textAlign: 'center', marginBottom: '8px' }}>
              Reset Password
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textAlign: 'center', marginBottom: '28px' }}>
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <IconInput icon={<Mail size={16} />} placeholder="Email" type="email" value={email} onChange={setEmail} />
              {error   && <p style={{ color: '#ff8a80', fontSize: '12.5px', textAlign: 'center', margin: 0 }}>{error}</p>}
              {message && <p style={{ color: '#8ecfc9', fontSize: '12.5px', textAlign: 'center', margin: 0 }}>{message}</p>}
              <button type="submit" disabled={loading} style={{
                background: loading ? '#6b9e9a' : 'linear-gradient(135deg, #8ecfc9, #0abfb8)',
                color: '#fff', border: 'none', borderRadius: '30px',
                padding: '14px', fontSize: '15px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Poppins, sans-serif', marginTop: '6px',
              }}>
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <span onClick={() => switchMode('login')} style={{ color: '#fff', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                ← Back to Login
              </span>
            </div>
          </>
        )}

        {/* ── LOGIN / REGISTER ── */}
        {mode !== 'forgot' && (
          <>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 600, textAlign: 'center', marginBottom: '28px' }}>
              {mode === 'login' ? 'Welcome back!' : 'Sign up to get started'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mode === 'register' && (
                <IconInput icon={<User size={16} />} placeholder="Full Name" value={name} onChange={setName} />
              )}
              <IconInput icon={<Mail size={16} />} placeholder="Email" type="email" value={email} onChange={setEmail} />
              <IconInput icon={<Lock size={16} />} placeholder="Password" type="password" value={password} onChange={setPass} />
              {mode === 'register' && (
                <IconInput icon={<Lock size={16} />} placeholder="Confirm Password" type="password" value={confirm} onChange={setConfirm} />
              )}

              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                  <span
                    onClick={() => switchMode('forgot')}
                    style={{ color: '#8ecfc9', fontSize: '12.5px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Forgot password?
                  </span>
                </div>
              )}

              {mode === 'register' && (
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', textAlign: 'center', textDecoration: 'underline', cursor: 'pointer' }}>
                  By signing up, I agree to the Terms of service &amp; Privacy Policy
                </p>
              )}

              {error && <p style={{ color: '#ff8a80', fontSize: '12.5px', textAlign: 'center', margin: 0 }}>{error}</p>}

              <button type="submit" disabled={loading} style={{
                background: loading ? '#6b9e9a' : 'linear-gradient(135deg, #8ecfc9, #0abfb8)',
                color: '#fff', border: 'none', borderRadius: '30px',
                padding: '14px', fontSize: '15px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Poppins, sans-serif', marginTop: '6px', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '0.9' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
              >
                {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign in'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {mode === 'login' ? (
                <>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '4px' }}>Don't have an account?</p>
                  <span onClick={() => switchMode('register')} style={{ color: '#fff', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}>
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '4px' }}>Already have an account?</p>
                  <span onClick={() => switchMode('login')} style={{ color: '#fff', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}>
                    Login
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}