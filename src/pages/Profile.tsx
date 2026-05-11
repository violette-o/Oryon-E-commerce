import './Profile.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoClaro   from '../assets/Logo Oryon claro.png'
import profileBack from '../assets/ProfileBack.png'

// ── Constelación SVG ───────────────────────────────────
function Constellation() {
  return (
    <svg className="profile-constellation" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
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
  return (
    <button className="profile-side-btn" onClick={onClick}>
      {label}
    </button>
  )
}

// ── Avatar ─────────────────────────────────────────────
function Avatar({ size, initials }: { size: number; initials: string }) {
  return (
    <div
      className="profile-avatar"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials}
    </div>
  )
}

// ══════════════════════════════════════════════════════
export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'info' | 'edit'>('info')

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="profile-page">

      {/* ── SIDEBAR ── */}
      <aside className="profile-sidebar">
        <Constellation />

        <div className="profile-sidebar-top">
          <button className="profile-back-btn" onClick={() => navigate('/')}>←</button>
        </div>

        <img src={logoClaro} alt="Oryon" className="profile-logo" />

        <div className="profile-side-btns">
          <SideBtn label="Security" />
          <SideBtn label="Notifications" />
          <SideBtn label="Account settings" />
          <SideBtn label="Email" />
        </div>

        <div className="profile-sidebar-spacer" />

        <div className="profile-sidebar-bottom">
          <SideBtn label="Logout" onClick={() => { logout(); navigate('/') }} />
        </div>
      </aside>

      {/* ── ÁREA DERECHA ── */}
      <div className="profile-content">

        {/* Background imagen */}
        <img src={profileBack} alt="" className="profile-bg-img" />

        {/* Header con tabs */}
        <div className="profile-header">
          {tab === 'edit' && (
            <Avatar size={70} initials={initials} />
          )}
          <div className="profile-header-info">
            <h2 className="profile-title">Profile</h2>
            <div className="profile-tabs">
              <span
                className={`profile-tab ${tab === 'info' ? 'profile-tab--active' : ''}`}
                onClick={() => setTab('info')}
              >🔒 Personal information</span>
              <span
                className={`profile-tab ${tab === 'edit' ? 'profile-tab--active' : ''}`}
                onClick={() => setTab('edit')}
              >✏️ Edit Profile</span>
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="profile-card-area">

          {/* TAB: Personal Info */}
          {tab === 'info' && (
            <div className="profile-card">
              <Constellation />
              <div className="profile-info-inner">
                <Avatar size={160} initials={initials} />
                <div className="profile-fields">
                  {[
                    { value: user?.name,  placeholder: 'Full Name' },
                    { value: user?.email, placeholder: 'Email' },
                    { value: '',          placeholder: 'Phone' },
                  ].map((field, i) => (
                    <div key={i} className="profile-field-row">
                      <span className="profile-field-icon">👤</span>
                      <span className={`profile-field-value ${!field.value ? 'profile-field-value--empty' : ''}`}>
                        {field.value || field.placeholder}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Edit Profile */}
          {tab === 'edit' && (
            <div className="profile-edit-wrapper">
              <div className="profile-card">
                <Constellation />
                <div className="profile-edit-grid">
                  {[
                    'First Name',   'My products',
                    'Last Name',    'Cart',
                    'Age',          'Devolutions',
                    'Location',     'Billings',
                  ].map(label => (
                    <button key={label} className="profile-edit-btn">
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