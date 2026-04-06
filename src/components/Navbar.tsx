import logoNegro from '../assets/Logo Oryon negro.png'
import { ShoppingCart, User, Search, Menu } from 'lucide-react'

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 48px',
      borderBottom: '1px solid #e5e5e5',
      backgroundColor: '#fff',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Menu size={20} color="#333" style={{ cursor: 'pointer' }} />
        <a href="#" style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Home</a>
        <a href="#" style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Shop now</a>
        <a href="#" style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Contact</a>
      </div>

      <img src={logoNegro} alt="Oryon" style={{ height: '36px', objectFit: 'contain' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid #ccc',
        }}>
          <Search size={14} color="#999" />
          <input
            type="text"
            placeholder="Search"
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              fontFamily: 'Poppins, sans-serif',
              width: '120px' ,
              backgroundColor: 'transparent',
              color: '#333'
            }}
          />
        </div>
        <ShoppingCart size={22} color="#333" style={{ cursor: 'pointer' }} />
        <User size={22} color="#333" style={{ cursor: 'pointer' }} />
      </div>
    </nav>
  )
}

export default Navbar