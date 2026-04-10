import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoNegro from '../assets/Logo oryon negro.png'

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [hoveredItem,  setHoveredItem]  = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const sections = [
    { title: 'Categories', titleAction: null, sub: [
      { label: 'Headphones',   action: null },
      { label: 'Smartphones',  action: null },
      { label: 'Accesories',   action: null },
      { label: 'Smartwatches', action: null },
      { label: 'Tablets',      action: null },
    ]},
    { title: 'Offers',       titleAction: null,                                                   sub: [] },
    { title: 'New Arrivals', titleAction: null,                                                   sub: [] },
    { title: 'Wishlist',     titleAction: () => { navigate('/wishlist'); setSidebarOpen(false) }, sub: [] },
    { title: 'Cart', titleAction: () => { navigate('/cart'); window.scrollTo(0, 0); setSidebarOpen(false) }, sub: [] },
    { title: 'My Account',   titleAction: null, sub: isLoggedIn ? [
      { label: 'My Profile',         action: () => { navigate('/profile'); setSidebarOpen(false) } },
    ] : [
      { label: 'Sign In / Register', action: () => { navigate('/login'); setSidebarOpen(false) } },
    ]},
    { title: 'My Orders',    titleAction: null, sub: [] },
    { title: 'Help / Support', titleAction: null, sub: [
      { label: 'Contact',           action: null },
      { label: 'FAQ',               action: null },
      { label: 'Shipping & Returns',action: null },
    ]},
  ]

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <>
      {/* ── Overlay ────────────────────────────────── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200 }}
        />
      )}

      {/* ── Sidebar ────────────────────────────────── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0,
        width: '300px', height: '100%',
        background: '#fff', zIndex: 201,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-300px)',
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
        fontFamily: 'Poppins, sans-serif',
      }}>
        <div style={{ padding: '24px 28px 8px' }}>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Menu size={24} color="#1a1a1a" />
          </button>
        </div>

        <div style={{ padding: '8px 28px 40px', display: 'flex', flexDirection: 'column' }}>
          {sections.map((section) => (
            <div key={section.title} style={{ marginTop: '20px' }}>
              <span
                onClick={() => section.titleAction?.()}
                onMouseEnter={() => setHoveredItem(section.title)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  fontSize: '22px', fontWeight: 600,
                  color: hoveredItem === section.title ? '#0abfb8' : '#1a1a1a',
                  textDecoration: 'underline', textUnderlineOffset: '4px',
                  cursor: section.titleAction ? 'pointer' : 'default', display: 'block',
                  marginBottom: section.sub.length > 0 ? '8px' : '0',
                  transition: 'color 0.2s',
                }}
              >
                {section.title}
              </span>
              {section.sub.map((item) => (
                <span
                  key={item.label}
                  onClick={() => item.action?.()}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    display: 'block', fontSize: '13.5px', fontWeight: 400,
                    color: hoveredItem === item.label ? '#0abfb8' : '#444',
                    padding: '7px 0', transition: 'color 0.2s',
                    cursor: item.action ? 'pointer' : 'default',
                  }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Navbar ─────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', borderBottom: '1px solid #e5e5e5',
        backgroundColor: '#fff', fontFamily: 'Poppins, sans-serif',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Menu size={20} color="#333" style={{ cursor: 'pointer' }} onClick={() => setSidebarOpen(true)} />
          <Link to="/"        style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Home</Link>
          <Link to="/product" style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Shop now</Link>
          <a href="#"         style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Contact</a>
        </div>

        <Link to="/">
          <img src={logoNegro} alt="Oryon" style={{ height: '36px', objectFit: 'contain', display: 'block' }} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '20px', border: '1px solid #ccc',
          }}>
            <Search size={14} color="#999" />
            <input
              type="text" placeholder="Search"
              style={{
                border: 'none', outline: 'none', fontSize: '13px',
                fontFamily: 'Poppins, sans-serif', width: '120px',
                backgroundColor: 'transparent', color: '#333',
              }}
            />
          </div>

          <ShoppingCart
          size={22} color="#333"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (isLoggedIn) { navigate('/cart'); window.scrollTo(0, 0) }
              else navigate('/login')
              }}
            />

          {isLoggedIn ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setShowDropdown(d => !d)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#0abfb8', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer',
                  color: '#fff', fontSize: '13px', fontWeight: 700,
                  userSelect: 'none',
                }}
              >
                {initials}
              </div>

              {showDropdown && (
                <div style={{
                  position: 'absolute', top: '44px', right: 0,
                  background: '#fff', borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '1px solid #e0e0e0',
                  minWidth: '180px', padding: '8px 0', zIndex: 200,
                }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>{user?.name}</p>
                    <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>{user?.email}</p>
                  </div>
                  <a href="#" onClick={() => { navigate('/profile'); setShowDropdown(false) }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#555', textDecoration: 'none' }}>
                    <User size={14} /> My Profile
                  </a>
                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#555', textDecoration: 'none' }}>
                    <ShoppingCart size={14} /> My Orders
                  </a>
                  <button
                    onClick={() => { logout(); setShowDropdown(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 16px', fontSize: '13px', color: '#ff4444',
                      background: 'none', border: 'none', cursor: 'pointer',
                      width: '100%', fontFamily: 'Poppins, sans-serif',
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <User
              size={22} color="#333"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            />
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar