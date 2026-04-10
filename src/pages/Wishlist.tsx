import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

// ── Assets ─────────────────────────────────────────────
import imgSamsungPods  from '../assets/Samsungpods.png'
import imgIpadMini     from '../assets/IpadMini.png'
import imgAirpodsPro3  from '../assets/AirPodsPro3.png'
import imgSonyBlack    from '../assets/SonyBlack.png'
import imgJBLClip      from '../assets/JBLClip.png'
import imgIphone17     from '../assets/Iphone17ProMax.png'

// ── Tipos ──────────────────────────────────────────────
interface WishItem {
  id: number
  name: string
  price: string
  img: string
}

const initialWishlist: WishItem[] = [
  { id: 1, name: 'Headphones Samsung',    price: '$ 2.077.000 COP', img: imgSamsungPods  },
  { id: 2, name: 'Apple ipad mini 256gb', price: '$ 2.200.000 COP', img: imgIpadMini     },
  { id: 3, name: 'AirPods Pro 3',         price: '$ 1.100.000 COP', img: imgAirpodsPro3  },
]

const suggestions: WishItem[] = [
  { id: 4, name: 'Headphones Sony',        price: '$ 1.300.000 COP', img: imgSonyBlack },
  { id: 5, name: 'Bafle JBL Clip',         price: '$ 350.000 COP',   img: imgJBLClip   },
  { id: 6, name: 'Apple iPhone 17 Pro Max',price: '$ 5.400.000 COP', img: imgIphone17  },
]

// ── Tarjeta de wishlist ────────────────────────────────
function WishCard({
  item, onRemove, onAddToCart, showAdd = false
}: {
  item: WishItem
  onRemove?: () => void
  onAddToCart: (item: WishItem) => void
  showAdd?: boolean
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '10px', fontFamily: 'Poppins, sans-serif',
    }}>
      <div style={{
        width: '100%', aspectRatio: '1', background: '#f0f0f0',
        borderRadius: '20px', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}>
        <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', margin: 0, textAlign: 'center' }}>
        {item.name}
      </p>
      <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{item.price}</p>

      <button
        onClick={() => onAddToCart(item)}
        style={{
          background: '#0abfb8', color: '#fff', border: 'none',
          borderRadius: '20px', padding: '10px 24px',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Poppins, sans-serif', width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#089990')}
        onMouseLeave={e => (e.currentTarget.style.background = '#0abfb8')}
      >
        <ShoppingCart size={15} /> Add to cart
      </button>

      <span
        onClick={onRemove}
        style={{
          fontSize: '13px', color: '#1a1a1a', cursor: 'pointer',
          textDecoration: 'underline', fontFamily: 'Poppins, sans-serif',
        }}
      >
        {showAdd ? 'Add' : 'Remove'}
      </span>
    </div>
  )
}

// ══════════════════════════════════════════════════════
export default function Wishlist() {
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState<WishItem[]>(initialWishlist)
  const [added, setAdded] = useState<string | null>(null)

  const handleAddToCart = (item: WishItem) => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    item.id,
      name:  item.name,
      price: parseInt(item.price.replace(/[^0-9]/g, '')),
      img:   item.img,
    })
    setAdded(item.name)
    setTimeout(() => setAdded(null), 2000)
  }

  const handleRemove = (id: number) => {
    setWishlist(prev => prev.filter(item => item.id !== id))
  }

  const handleAddFromSuggestion = (item: WishItem) => {
    if (!wishlist.find(w => w.id === item.id)) {
      setWishlist(prev => [...prev, item])
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />

      {/* Toast de confirmación */}
      {added && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 999,
          background: '#0abfb8', color: '#fff', padding: '12px 24px',
          borderRadius: '12px', fontSize: '13px', fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.2s ease',
        }}>
          ✓ {added} added to cart!
        </div>
      )}

      <div style={{ textAlign: 'center', padding: '32px 0 16px' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>
          Save your favorite products and add them to your cart anytime.
        </p>
      </div>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {wishlist.map(item => (
            <WishCard
              key={item.id}
              item={item}
              onRemove={() => handleRemove(item.id)}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px 60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', color: '#1a1a1a' }}>
          You may also like
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {suggestions.map(item => (
            <WishCard
              key={item.id}
              item={item}
              onRemove={() => handleAddFromSuggestion(item)}
              onAddToCart={handleAddToCart}
              showAdd
            />
          ))}
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}