import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoClaro from '../assets/Logo Oryon claro.png'

// ── Constelación SVG de fondo ──────────────────────────
function Constellation() {
  return (
    <svg
      className="login-constellation"
      viewBox="0 0 1440 820"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Líneas izquierda */}
      <line x1="80"  y1="120" x2="200" y2="80"  stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="200" y1="80"  x2="340" y2="160" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="340" y1="160" x2="260" y2="300" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="260" y1="300" x2="80"  y2="380" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="80"  y1="380" x2="140" y2="500" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="140" y1="500" x2="80"  y2="600" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="120" y1="460" x2="240" y2="480" stroke="rgba(255,255,255,0.20)" strokeWidth="1" />
      <line x1="50"  y1="280" x2="130" y2="260" stroke="rgba(255,255,255,0.20)" strokeWidth="1" />
      {[
        [80,120],[200,80],[340,160],[260,300],[80,380],[140,500],[80,600],[120,460],[240,480],[50,280],[130,260]
      ].map(([cx,cy], i) => (
        <circle key={`l${i}`} cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.5)" />
      ))}

      {/* Líneas derecha */}
      <line x1="1100" y1="80"  x2="1260" y2="140" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1260" y1="140" x2="1380" y2="100" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1380" y1="100" x2="1360" y2="240" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1360" y1="240" x2="1200" y2="300" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1200" y1="300" x2="1100" y2="420" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1100" y1="420" x2="1300" y2="480" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="1300" y1="480" x2="1380" y2="400" stroke="rgba(255,255,255,0.20)" strokeWidth="1" />
      {[
        [1100,80],[1260,140],[1380,100],[1360,240],[1200,300],[1100,420],[1300,480],[1380,400]
      ].map(([cx,cy], i) => (
        <circle key={`r${i}`} cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.5)" />
      ))}

      {/* Puntos dispersos */}
      {[
        [420,60],[500,200],[160,640],[320,700],[1050,600],[1200,680],[900,720],[600,740]
      ].map(([cx,cy], i) => (
        <circle key={`s${i}`} cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.3)" />
      ))}
    </svg>
  )
}

// ── Input con ícono ────────────────────────────────────
function IconInput({
  icon, type = 'text', placeholder, value, onChange, required = false
}: {
  icon: React.ReactNode
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div className={`login-input-wrapper ${focused ? 'login-input-wrapper--focused' : ''}`}>
      <span className="login-input-icon">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="login-input"
      />
    </div>
  )
}

// ── Componente principal ────────────────────────────────
export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [mode,     setMode]    = useState<'login' | 'register'>('login')
  const [name,     setName]    = useState('')
  const [email,    setEmail]   = useState('')
  const [password, setPass]    = useState('')
  const [confirm,  setConfirm] = useState('')
  const [error,    setError]   = useState('')
  const [loading,  setLoading] = useState(false)

  const switchMode = (m: 'login' | 'register') => {
    setMode(m); setError(''); setName(''); setEmail(''); setPass(''); setConfirm('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'register') {
      if (!name.trim())         { setError('Please enter your name.');                   return }
      if (password !== confirm) { setError('Passwords do not match.');                   return }
      if (password.length < 6)  { setError('Password must be at least 6 characters.');  return }
    }

    setLoading(true)
    let ok = false
    if (mode === 'login') {
      ok = await login(email, password)
      if (!ok) setError('Email or password incorrect.')
    } else {
      ok = await register(name, email, password)
    }
    setLoading(false)
    if (ok) navigate('/')
  }

  return (
    <div className="login-page">
      <Constellation />

      {/* Flecha atrás */}
      <button className="login-back-btn" onClick={() => navigate('/')}>←</button>

      {/* Header */}
      <div className="login-header">
        <p className="login-welcome">Welcome to</p>
        <img src={logoClaro} alt="Oryon" className="login-logo" />
      </div>

      {/* Card */}
      <div className="login-card">
        <h2 className="login-card-title">
          {mode === 'login' ? 'Welcome back!' : 'Sign up to get started'}
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'register' && (
            <IconInput icon={<User size={16} />} placeholder="Full Name" value={name} onChange={setName} required />
          )}

          <IconInput
            icon={mode === 'register' ? <Mail size={16} /> : undefined as unknown as React.ReactNode}
            placeholder="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />

          <IconInput
            icon={mode === 'register' ? <Lock size={16} /> : undefined as unknown as React.ReactNode}
            placeholder="Password"
            type="password"
            value={password}
            onChange={setPass}
            required
          />

          {mode === 'register' && (
            <IconInput icon={<Lock size={16} />} placeholder="Confirm Password" type="password" value={confirm} onChange={setConfirm} required />
          )}

          {mode === 'login' && (
            <div className="login-forgot">
              <span>Forgot password?</span>
            </div>
          )}

          {mode === 'register' && (
            <p className="login-terms">
              By signing up, I agree to the Terms of service &amp; Privacy Policy
            </p>
          )}

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`login-submit-btn ${loading ? 'login-submit-btn--loading' : ''}`}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign in'}
          </button>
        </form>

        {/* Toggle */}
        <div className="login-toggle">
          {mode === 'login' ? (
            <>
              <p className="login-toggle-text">Don't have an account?</p>
              <span className="login-toggle-link" onClick={() => switchMode('register')}>Sign Up</span>
            </>
          ) : (
            <>
              <p className="login-toggle-text">Already have an account?</p>
              <span className="login-toggle-link" onClick={() => switchMode('login')}>Login</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}