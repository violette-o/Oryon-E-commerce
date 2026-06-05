import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import './NewArrivals.css'

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

export default function NewArrivals() {
  const navigate       = useNavigate()
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const { products, loading } = useProducts()

  const newArrivals = products.map((p, i) => ({
    id:    p.id ?? p.name,
    name:  p.name,
    price: p.price,
    img:   p.images?.[0] ?? '',
    isNew: i < 5,
  }))

  const handleAddToCart = (item: typeof newArrivals[0]) => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    item.name.length + item.price,
      name:  item.name,
      price: item.price,
      img:   item.img,
    })
    setAdded(item.name)
    setTimeout(() => setAdded(null), 2000)
  }

  return (
    <div className="newarrivals-page">
      <Navbar />

      {added && <div className="newarrivals-toast">✓ {added} added to cart!</div>}

      <div className="newarrivals-header">
        <h1>New Arrivals</h1>
        <p>The latest products just landed</p>
      </div>

      <section className="newarrivals-section">
        {loading && <p className="newarrivals-msg">Loading products...</p>}
        {!loading && newArrivals.length === 0 && (
          <p className="newarrivals-msg">No products available.</p>
        )}
        {!loading && newArrivals.length > 0 && (
          <div className="newarrivals-grid">
            {newArrivals.map(item => (
              <div key={item.id} className="newarrivals-card" onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: 'pointer' }}>
                {item.isNew && <div className="newarrivals-badge">NEW</div>}
                <div className="newarrivals-card-img">
                  {item.img
                    ? <img src={item.img} alt={item.name} />
                    : <span style={{ fontSize: '12px', color: '#bbb' }}>No image</span>
                  }
                </div>
                <div className="newarrivals-card-body">
                  <p className="newarrivals-card-name">{item.name}</p>
                  <p className="newarrivals-card-price">{formatPrice(item.price)}</p>
                  <button
                    className="newarrivals-btn-cart"
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