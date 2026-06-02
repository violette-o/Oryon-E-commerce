import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SharedFooter from '../components/SharedFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import type { Product as FSProduct } from '../services/products'
import './Home.css'

import imgIphoneHero from '../assets/Iphone Hero.png'
import imgAirpods    from '../assets/Airpods.png'
import imgIpad       from '../assets/ipad.png'
import imgIphonePink from '../assets/Iphonepink.png'
import imgAirpodsMax from '../assets/AirpodsMax.png'
import imgAsusbook   from '../assets/Asusbook.png'

// ── Tipo local ─────────────────────────────────────────
interface Product {
  id:    string
  name:  string
  price: number
  img:   string
}

// ── Categorías del grid ────────────────────────────────
const categories = [
  { name: 'Headphones', image: imgAirpodsMax, path: '/categories/headphones' },
  { name: 'AirPods',    image: imgAirpods,    path: '/categories/headphones' },
  { name: 'iPad',       image: imgIpad,       path: '/categories/tablets'    },
  { name: 'iPhone',     image: imgIphonePink, path: '/categories/smartphones'},
]

// ── Convertir Firestore → local ────────────────────────
function toLocal(p: FSProduct): Product {
  return { id: p.id ?? p.name, name: p.name, price: p.price, img: p.images?.[0] ?? '' }
}

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

// ── Carrusel ───────────────────────────────────────────
function HomeCarousel({
  items, onAddToCart, visibleCount = 3, hideInfo = false, onCardClick
}: {
  items: Product[]
  onAddToCart: (item: Product) => void
  visibleCount?: number
  hideInfo?: boolean
  onCardClick?: (index: number) => void
}) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const max = Math.max(0, items.length - visibleCount)

  const goTo = (newIndex: number) => {
    if (!trackRef.current) return
    const card = trackRef.current.children[0] as HTMLElement
    trackRef.current.scrollLeft = newIndex * (card.offsetWidth + 20)
    setIndex(newIndex)
  }

  return (
    <div className="home-carousel-wrapper">
      {index > 0 && (
        <button className="home-carousel-arrow left" onClick={() => goTo(index - 1)}>
          <ChevronLeft size={16} />
        </button>
      )}
      <div ref={trackRef} className="home-carousel-track">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={hideInfo ? 'home-arrival-card' : 'home-product-card'}
            onClick={() => onCardClick?.(i)}
            style={{ cursor: onCardClick ? 'pointer' : 'default' }}
          >
            <div className={hideInfo ? 'home-arrival-card-img' : 'home-product-card-img'}>
              {item.img
                ? <img src={item.img} alt={item.name} />
                : <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
              }
            </div>
            {!hideInfo && (
              <div className="home-product-card-body">
                <div className="home-product-card-name">{item.name}</div>
                <div className="home-product-card-price">{formatPrice(item.price)}</div>
                <button
                  className="home-btn-cart"
                  onClick={e => { e.stopPropagation(); onAddToCart(item) }}
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {index < max && (
        <button className="home-carousel-arrow right" onClick={() => goTo(index + 1)}>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════
export default function Home() {
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const navigate       = useNavigate()
  const { products, loading } = useProducts()

  const [added, setAdded] = useState<string | null>(null)

  // ── Secciones dinámicas desde Firestore ───────────────
  const allLocal    = products.map(toLocal)
  const bestSellers = allLocal.filter(p => products.find(fp => fp.id === p.id)?.category === 'Headphones').slice(0, 4)
  const featured    = allLocal.filter(p => ['Headphones','Tablets','Smartphones'].includes(products.find(fp => fp.id === p.id)?.category ?? '')).slice(0, 3)
  const newArrivals = allLocal.slice(0, 6)

  const handleAddToCart = (item: Product) => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({ id: item.name.length + item.price, name: item.name, price: item.price, img: item.img })
    setAdded(item.name)
    setTimeout(() => setAdded(null), 2000)
  }

  return (
    <div className="home-page">
      <Navbar />

      {added && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 999,
          background: '#0abfb8', color: '#fff', padding: '12px 24px',
          borderRadius: '12px', fontSize: '13px', fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          ✓ {added} added to cart!
        </div>
      )}

      {/* ══ HERO ═════════════════════════════════════ */}
      <section className="home-hero">
        <div className="home-hero-text">
          <h1>Upgrade the way you experience tech</h1>
          <p>From powerful audio to smart devices, find everything you need in one place.</p>
          <button className="home-hero-btn" onClick={() => navigate('/categories')}>Shop now</button>
        </div>
        <div className="home-hero-img">
          <img src={imgIphoneHero} alt="Hero product" />
        </div>
      </section>

      {/* ══ CATEGORY GRID ════════════════════════════ */}
      <section className="home-categories">
        {categories.map(cat => (
          <div
            key={cat.name}
            className="home-category-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(cat.path)}
          >
            <img src={cat.image} alt={cat.name} />
          </div>
        ))}
      </section>

      {/* ══ FOOTER BAR (teal) ════════════════════════ */}
      <Footer />

      {/* ══ BEST SELLERS ═════════════════════════════ */}
      <section className="home-section">
        <h2 className="home-section-title">Best seller Products</h2>
        <p className="home-section-sub">The products everyone is loving</p>
        {loading
          ? <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>Loading...</p>
          : <HomeCarousel items={bestSellers} onAddToCart={handleAddToCart} visibleCount={2} />
        }
      </section>

      {/* ══ PROMO BANNER ═════════════════════════════ */}
      <section className="home-promo-banner" style={{ marginTop: '80px' }}>
        <img src={imgAsusbook} alt="Laptop" className="home-promo-img" />
        <div className="home-promo-text">
          <h2>Exclusive tech deals.</h2>
          <p>Don't miss out.</p>
          <button className="home-promo-btn" onClick={() => navigate('/offers')}>Shop now</button>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ════════════════════════ */}
      <section className="home-section">
        <h2 className="home-section-title">Featured Products</h2>
        <p className="home-section-sub">Handpicked products we recommend</p>
        {loading
          ? <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>Loading...</p>
          : (
            <div className="home-featured-grid">
              {featured.map(item => (
                <div key={item.id} className="home-product-card">
                  <div className="home-product-card-img">
                    {item.img
                      ? <img src={item.img} alt={item.name} />
                      : <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                    }
                  </div>
                  <div className="home-product-card-body">
                    <div className="home-product-card-name">{item.name}</div>
                    <div className="home-product-card-price">{formatPrice(item.price)}</div>
                    <button className="home-btn-cart" onClick={() => handleAddToCart(item)} aria-label="Add to cart">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>

      {/* ══ NEW ARRIVALS ═════════════════════════════ */}
      <section className="home-new-arrivals">
        <div className="home-new-arrivals-badge">New arrivals</div>
        {!loading && <HomeCarousel items={newArrivals} onAddToCart={handleAddToCart} hideInfo />}
      </section>

      {/* ══ NEWSLETTER ═══════════════════════════════ */}
      <section className="home-newsletter">
        <h3>Subscribe to our Newsletter!</h3>
        <p>Stay updated with the latest products, exclusive offers, and technology news.</p>
        <div className="home-newsletter-form">
          <input type="email" placeholder="Email" />
          <button>Send</button>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}