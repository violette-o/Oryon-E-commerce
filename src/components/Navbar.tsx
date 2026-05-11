import './Navbar.css'
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
      { label: 'Headphones',    action: null },
      { label: 'Smartphones',   action: null },
      { label: 'Accesories',    action: null },
      { label: 'Smartwatches',  action: null },
      { label: 'Tablets',       action: null },
    ]},
    { title: 'Offers',         titleAction: null, sub: [] },
    { title: 'New Arrivals',   titleAction: null, sub: [] },
    { title: 'Wishlist',       titleAction: () => { navigate('/wishlist'); setSidebarOpen(false) }, sub: [] },
    { title: 'Cart',           titleAction: () => { navigate('/cart'); window.scrollTo(0, 0); setSidebarOpen(false) }, sub: [] },
    { title: 'My Account',     titleAction: null, sub: isLoggedIn ? [
      { label: 'My Profile', action: () => { navigate('/profile'); setSidebarOpen(false) } },
    ] : [
      { label: 'Sign In / Register', action: () => { navigate('/login'); setSidebarOpen(false) } },
    ]},
    { title: 'My Orders',      titleAction: null, sub: [] },
    { title: 'Help / Support', titleAction: null, sub: [
      { label: 'Contact',            action: null },
      { label: 'FAQ',                action: null },
      { label: 'Shipping & Returns', action: null },
    ]},
  ]

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <>
      {/* ── Overlay ── */}
      {sidebarOpen && (
        <div className="navbar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`navbar-sidebar ${sidebarOpen ? 'navbar-sidebar--open' : ''}`}>
        <div className="navbar-sidebar-header">
          <button className="navbar-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <Menu size={24} color="#1a1a1a" />
          </button>
        </div>

        <div className="navbar-sidebar-body">
          {sections.map((section) => (
            <div key={section.title} className="navbar-sidebar-section">
              <span
                onClick={() => section.titleAction?.()}
                onMouseEnter={() => setHoveredItem(section.title)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`navbar-sidebar-title ${section.titleAction ? 'navbar-sidebar-title--clickable' : ''} ${hoveredItem === section.title ? 'navbar-sidebar-title--hovered' : ''}`}
              >
                {section.title}
              </span>
              {section.sub.map((item) => (
                <span
                  key={item.label}
                  onClick={() => item.action?.()}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`navbar-sidebar-item ${item.action ? 'navbar-sidebar-item--clickable' : ''} ${hoveredItem === item.label ? 'navbar-sidebar-item--hovered' : ''}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Navbar ── */}
      <nav className="navbar">

        {/* Izquierda */}
        <div className="navbar-left">
          <Menu size={20} color="#333" className="navbar-menu-icon" onClick={() => setSidebarOpen(true)} />
          <div className="navbar-links">
            <Link to="/"        className="navbar-link">Home</Link>
            <Link to="/product" className="navbar-link">Shop now</Link>
            <a href="#"         className="navbar-link">Contact</a>
          </div>
        </div>

        {/* Centro: logo */}
        <Link to="/">
          <img src={logoNegro} alt="Oryon" className="navbar-logo" />
        </Link>

        {/* Derecha */}
        <div className="navbar-right">
          <div className="navbar-search">
            <Search size={14} color="#999" />
            <input type="text" placeholder="Search" className="navbar-search-input" />
          </div>

          <ShoppingCart
            size={22} color="#333"
            className="navbar-icon"
            onClick={() => {
              if (isLoggedIn) { navigate('/cart'); window.scrollTo(0, 0) }
              else navigate('/login')
            }}
          />

          {isLoggedIn ? (
            <div ref={dropdownRef} className="navbar-dropdown-wrapper">
              <div className="navbar-avatar" onClick={() => setShowDropdown(d => !d)}>
                {initials}
              </div>

              {showDropdown && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <p className="navbar-dropdown-name">{user?.name}</p>
                    <p className="navbar-dropdown-email">{user?.email}</p>
                  </div>
                  <a href="#" className="navbar-dropdown-item" onClick={() => { navigate('/profile'); setShowDropdown(false) }}>
                    <User size={14} /> My Profile
                  </a>
                  <a href="#" className="navbar-dropdown-item">
                    <ShoppingCart size={14} /> My Orders
                  </a>
                  <button className="navbar-dropdown-logout" onClick={() => { logout(); setShowDropdown(false) }}>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <User size={22} color="#333" className="navbar-icon" onClick={() => navigate('/login')} />
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar