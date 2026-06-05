import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import './Offers.css'

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

function getOriginalPrice(price: number, discount: number) {
  return Math.round(price / (1 - discount / 100))
}

export default function Offers() {
  const navigate       = useNavigate()
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const { products, loading } = useProducts()

  // Solo productos que tienen descuento en el seed
  const offers = products
    .filter(p => (p as any).discount)
    .map(p => ({
      id:            p.id ?? p.name,
      name:          p.name,
      salePrice:     p.price,
      originalPrice: getOriginalPrice(p.price, (p as any).discount),
      discount:      (p as any).discount as number,
      img:           p.images?.[0] ?? '',
    }))

  const handleAddToCart = (item: typeof offers[0]) => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    item.name.length + item.salePrice,
      name:  item.name,
      price: item.salePrice,
      img:   item.img,
    })
    setAdded(item.name)
    setTimeout(() => setAdded(null), 2000)
  }

  return (
    <div className="offers-page">
      <Navbar />

      {added && <div className="offers-toast">✓ {added} added to cart!</div>}

      <div className="offers-header">
        <h1>Exclusive Offers</h1>
        <p>Limited time deals — don't miss out</p>
      </div>

      <section className="offers-section">
        {loading && <p className="offers-msg">Loading offers...</p>}
        {!loading && offers.length === 0 && (
          <p className="offers-msg">No offers available right now.</p>
        )}
        {!loading && offers.length > 0 && (
          <div className="offers-grid">
            {offers.map(item => (
              <div key={item.id} className="offer-card" onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: 'pointer' }}>
                <div className="offer-badge">SAVE {item.discount}%</div>
                <div className="offer-card-img">
                  {item.img
                    ? <img src={item.img} alt={item.name} />
                    : <span style={{ fontSize: '12px', color: '#bbb' }}>No image</span>
                  }
                </div>
                <div className="offer-card-body">
                  <p className="offer-name">{item.name}</p>
                  <div className="offer-prices">
                    <span className="offer-price-old">{formatPrice(item.originalPrice)}</span>
                    <span className="offer-price-new">{formatPrice(item.salePrice)}</span>
                  </div>
                  <button
                    className="offer-btn-cart"
                    onClick={() => handleAddToCart(item)}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <SharedFooter />
    </div>
  )
}