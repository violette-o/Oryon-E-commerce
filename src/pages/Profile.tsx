import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoClaro   from '../assets/Logo Oryon claro.png'
import profileBack from '../assets/ProfileBack.png'

// ── Constelación SVG ───────────────────────────────────
function Constellation() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
    >
      <line x1="40"  y1="80"  x2="130" y2="130" stroke="white" strokeWidth="0.7" opacity="0.25" />
      <line x1="130" y1="130" x2="90"  y2="220" stroke="white" strokeWidth="0.7" opacity="0.25" />
      <line x1="200" y1="60"  x2="290" y2="100" stroke="white" strokeWidth="0.7" opacity="0.25" />
      <line x1="290" y1="100" x2="370" y2="70"  stroke="white" strokeWidth="0.7" opacity="0.25" />
      <line x1="320" y1="280" x2="380" y2="360" stroke="white" strokeWidth="0.7" opacity="0.25" />
      {[
        [40,80],[130,130],[90,220],[40,310],
        [200,60],[290,100],[370,70],[380,180],
        [320,280],[380,360],[150,420],[260,460]
      ].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="white" opacity="0.45" />
      ))}
    </svg>
  )
}

// ── Botón sidebar ──────────────────────────────────────
function SideBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', padding: '11px 0', borderRadius: '20px',
        border: `1.5px solid ${hovered ? '#0abfb8' : 'rgba(255,255,255,0.3)'}`,
        background: 'transparent',
        color: hovered ? '#0abfb8' : 'rgba(255,255,255,0.75)',
        fontSize: '13px', fontWeight: 400, cursor: 'pointer',
        fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  )
}

// ══════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════
export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'info' | 'edit'>('info')

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const Avatar = ({ size }: { size: number }) => (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #0abfb8, #089990)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, fontSize: size * 0.32, fontWeight: 700, color: '#fff',
      boxShadow: '0 4px 20px rgba(10,191,184,0.3)',
    }}>
      {initials}
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#2a2a2a',
      display: 'flex', fontFamily: 'Poppins, sans-serif',
      overflow: 'hidden',
    }}>

      {/* ── SIDEBAR ──────────────────────────────────── */}
      <aside style={{
        width: '240px', flexShrink: 0, background: '#2a2a2a',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '28px 24px',
        position: 'relative', zIndex: 2, overflow: 'hidden',
      }}>
        <Constellation />

        <div style={{ width: '100%', position: 'relative', zIndex: 1, marginBottom: '8px' }}>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '18px', cursor: 'pointer', padding: 0,
          }}>←</button>
        </div>

        <img src={logoClaro} alt="Oryon" style={{
          height: '32px', objectFit: 'contain', marginBottom: '32px',
          position: 'relative', zIndex: 1,
        }} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
          <SideBtn label="Security" />
          <SideBtn label="Notifications" />
          <SideBtn label="Account settings" />
          <SideBtn label="Email" />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ width: '100%', position: 'relative', zIndex: 1 }}>
          <SideBtn label="Logout" onClick={() => { logout(); navigate('/') }} />
        </div>
      </aside>

      {/* ── ÁREA DERECHA ─────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>

        {/* Background imagen */}
        <img src={profileBack} alt="" style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'left center',
          zIndex: 0,
        }} />

        {/* ── ZONA OSCURA: Header con Profile + tabs ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          flex: '0 0 auto',
          padding: '60px 60px 40px',
          display: 'flex', alignItems: 'center', gap: '24px',
        }}>
          {/* En edit mode muestra avatar en el header */}
          {tab === 'edit' && (
            <div style={{
              width: 70, height: 70, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0abfb8, #089990)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0,
              boxShadow: '0 4px 20px rgba(10,191,184,0.3)',
            }}>{initials}</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span
                onClick={() => setTab('info')}
                style={{
                  fontSize: '13px', cursor: 'pointer',
                  color: tab === 'info' ? '#fff' : 'rgba(255,255,255,0.6)',
                  textDecoration: tab === 'info' ? 'underline' : 'none',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'color 0.2s',
                }}
              >🔒 Personal information</span>
              <span
                onClick={() => setTab('edit')}
                style={{
                  fontSize: '13px', cursor: 'pointer',
                  color: tab === 'edit' ? '#fff' : 'rgba(255,255,255,0.6)',
                  textDecoration: tab === 'edit' ? 'underline' : 'none',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'color 0.2s',
                }}
              >✏️ Edit Profile</span>
            </div>
          </div>
        </div>

        {/* ── ZONA BLANCA: Card con contenido ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          flex: 1,
          padding: '120px 60px 60px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        }}>

          {/* ── TAB: Personal Info ── */}
          {tab === 'info' && (
            <div style={{
              background: '#3a3a3a', borderRadius: '24px',
              padding: '48px 44px', position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
              width: '100%', maxWidth: '760px',
            }}>
              <Constellation />
              <div style={{ display: 'flex', gap: '36px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <Avatar size={160} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {[
                    { value: user?.name,  placeholder: 'Full Name' },
                    { value: user?.email, placeholder: 'Full Name' },
                    { value: '',          placeholder: 'Full Name' },
                  ].map((field, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      border: '1.5px solid rgba(255,255,255,0.15)',
                      borderRadius: '30px', padding: '16px 24px',
                      background: 'rgba(255,255,255,0.04)',
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '16px' }}>👤</span>
                      <span style={{ color: field.value ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
                        {field.value || field.placeholder}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Edit Profile ── */}
          {tab === 'edit' && (
            <div style={{ width: '100%', maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: '#3a3a3a', borderRadius: '24px',
                padding: '44px 40px', position: 'relative', overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
              }}>
                <Constellation />
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '18px', position: 'relative', zIndex: 1,
                }}>
                  {[
                    'First Name',   'My products',
                    'Last Name',    'Cart',
                    'Age',          'Devolutions',
                    'Location',     'Billings',
                  ].map(label => (
                    <button key={label} style={{
                      padding: '15px 20px', borderRadius: '20px',
                      border: '1.5px solid rgba(255,255,255,0.2)',
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.6)', fontSize: '14px',
                      cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#0abfb8'
                      ;(e.currentTarget as HTMLButtonElement).style.color = '#0abfb8'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'
                    }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}