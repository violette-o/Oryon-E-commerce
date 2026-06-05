import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProductsByCategory } from '../hooks/useProducts'
import './CategoryPage.css'

// ── Metadata de categorías ─────────────────────────────
const categoryMeta: Record<string, { title: string; description: string }> = {
  headphones:  { title: 'Headphones',  description: 'Wireless, noise-cancelling and studio headphones' },
  smartphones: { title: 'Smartphones', description: 'Latest flagship and mid-range phones'             },
  accessories: { title: 'Accessories', description: 'Chargers, power banks, speakers and more'         },
  smartwatches:{ title: 'Smartwatches',description: 'Smart speakers, wearables and home devices'       },
  tablets:     { title: 'Tablets',     description: 'iPads and Android tablets for work and play'      },
}

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

export default function CategoryPage() {
  const { category }   = useParams<{ category: string }>()
  const navigate       = useNavigate()
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const [added, setAdded] = useState<string | null>(null)

  // Capitaliza para matchear con Firestore (headphones → Headphones)
  const firestoreCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : ''

  const { products, loading, error } = useProductsByCategory(firestoreCategory)
  const meta = category ? categoryMeta[category] : null

  if (!meta) {
    return (
      <div className="catpage-notfound">
        <Navbar />
        <p>Category not found.</p>
        <button onClick={() => navigate('/categories')}>← Back to Categories</button>
        <SharedFooter />
      </div>
    )
  }

  const handleAddToCart = (item: { id?: string | number; name: string; price: number; images: string[] }) => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    item.id ? Number(item.id) : item.price,
      name:  item.name,
      price: item.price,
      img:   item.images?.[0] ?? '',
    })
    setAdded(item.name)
    setTimeout(() => setAdded(null), 2000)
  }

  return (
    <div className="catpage">
      <Navbar />

      {added && <div className="catpage-toast">✓ {added} added to cart!</div>}

      {/* Header */}
      <div className="catpage-header">
        <span className="catpage-back" onClick={() => navigate('/categories')}>
          ← Back to Categories
        </span>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </div>

      {/* Grid */}
      <section className="catpage-section">
        {loading && <p className="catpage-msg">Loading products...</p>}
        {error   && <p className="catpage-msg catpage-msg--error">{error}</p>}
        {!loading && products.length === 0 && (
          <p className="catpage-msg">No products found in this category.</p>
        )}
        {!loading && products.length > 0 && (
          <div className="catpage-grid">
            {products.map(item => (
              <div key={item.id} className="catpage-card">
                <div className="catpage-card-img">
                  {item.images?.[0]
                    ? <img src={item.images[0]} alt={item.name} />
                    : <span className="catpage-card-noimg">No image</span>
                  }
                </div>
                <div className="catpage-card-body">
                  <p className="catpage-card-name">{item.name}</p>
                  <p className="catpage-card-price">{formatPrice(item.price)}</p>
                  <button
                    className="catpage-btn-cart"
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
