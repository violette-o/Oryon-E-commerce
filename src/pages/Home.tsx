import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import SharedFooter from '../components/SharedFooter'
import './Home.css'

// ── Assets ─────────────────────────────────────────────
import imgIphoneHero    from '../assets/Iphone Hero.png'
import imgAirpods       from '../assets/Airpods.png'
import imgIpad          from '../assets/ipad.png'
import imgIpadMini      from '../assets/IpadMini.png'
import imgAirpodsGreen  from '../assets/airpodsmaxgreen.png'
import imgAirpodsPro3   from '../assets/AirPodsPro3.png'
import imgSamsungPods   from '../assets/Samsungpods.png'
import imgAsusbook      from '../assets/Asusbook.png'
import imgIphonePink    from '../assets/Iphonepink.png'
import imgIphone17      from '../assets/Iphone17ProMax.png'
import imgAirpodsMax    from '../assets/AirpodsMax.png'
import imgPowerBank     from '../assets/Powerbank.png'
import imgJBL           from '../assets/JBL.png'
import imgHomePod       from '../assets/Homepod.png'

// ── Tipos ──────────────────────────────────────────────
interface Product {
  name: string
  price: string
  img: string
  path?: string
}

// ── Datos ──────────────────────────────────────────────
const bestSellers: Product[] = [
  { name: 'Headphones SAMSUNG',    price: '$2.077.000 COP', img: imgSamsungPods, path: '/product' },
  { name: 'Apple Ipad mini 256gb', price: '$ 2.200.000 COP', img: imgIpadMini,   path: '/product' },
]

const featured: Product[] = [
  { name: 'AirPods Max 2',     price: '$1.200.000 COP', img: imgAirpodsGreen, path: '/product' },
  { name: 'APPLE iPad Mini',   price: '$2.200.000 COP', img: imgIpadMini,     path: '/product' },
  { name: 'APPLE Airbuds Pro', price: '$1.100.000 COP', img: imgAirpodsPro3,  path: '/product' },
]

const newArrivals: Product[] = [
  { name: 'Power Bank Pro',    price: '$180.000 COP',   img: imgPowerBank,  path: '/product' },
  { name: 'AirPods Max Black', price: '$2.700.000 COP', img: imgIphone17,   path: '/product' },
  { name: 'HomePod',           price: '$5.200.000 COP', img: imgHomePod,    path: '/product' },
  { name: 'JBL Speaker',       price: '$2.200.000 COP', img: imgJBL,        path: '/product' },
]

const categories = [
  { name: 'Headphones', image: imgAirpodsMax,  path: '/product' },
  { name: 'AirPods',    image: imgAirpods,     path: '/product' },
  { name: 'iPad',       image: imgIpad,        path: '/product' },
  { name: 'iPhone',     image: imgIphonePink,  path: '/product' },
]

// ── Sub-componente: carrusel ───────────────────────────
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
  const visible = visibleCount
  const max = Math.max(0, items.length - visible)

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
            key={i}
            className={hideInfo ? 'home-arrival-card' : 'home-product-card'}
            onClick={() => onCardClick?.(i)}
            style={{ cursor: onCardClick ? 'pointer' : 'default' }}
          >
            <div className={hideInfo ? 'home-arrival-card-img' : 'home-product-card-img'}>
              <img src={item.img} alt={item.name} />
            </div>
            {!hideInfo && (
              <div className="home-product-card-body">
                <div className="home-product-card-name">{item.name}</div>
                <div className="home-product-card-price">{item.price}</div>
                <button
                  className="home-btn-cart"
                  onClick={(e) => { e.stopPropagation(); onAddToCart(item) }}
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
// HOME PRINCIPAL
// ══════════════════════════════════════════════════════
export default function Home() {
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const navigate = useNavigate()
  const [added, setAdded] = useState<string | null>(null)

  const handleAddToCart = (item: Product) => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    item.img.length,
      name:  item.name,
      price: parseInt(item.price.replace(/[^0-9]/g, '')),
      img:   item.img,
    })
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
          <button className="home-hero-btn" onClick={() => navigate('/product')}>Shop now</button>
        </div>
        <div className="home-hero-img">
          <img src={imgIphoneHero} alt="Hero product" />
        </div>
      </section>

      {/* ══ CATEGORY GRID ════════════════════════════ */}
      <section className="home-categories">
        {categories.map((cat) => (
          <div key={cat.name} className="home-category-card" style={{ cursor: 'default' }}>
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
        <HomeCarousel
          items={bestSellers}
          onAddToCart={handleAddToCart}
          visibleCount={2}
          onCardClick={(i) => {
            if (i === 0) { navigate('/product'); window.scrollTo(0, 0) }
          }}
        />
      </section>

      {/* ══ PROMO BANNER ═════════════════════════════ */}
      <section className="home-promo-banner" style={{ marginTop: '80px' }}>
        <img src={imgAsusbook} alt="Laptop" className="home-promo-img" />
        <div className="home-promo-text">
          <h2>Exclusive tech deals.</h2>
          <p>Don't miss out.</p>
          <button className="home-promo-btn" onClick={() => navigate('/product')}>Shop now</button>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ════════════════════════ */}
      <section className="home-section">
        <h2 className="home-section-title">Featured Products</h2>
        <p className="home-section-sub">Handpicked products we recommend</p>
        <div className="home-featured-grid">
          {featured.map((item, i) => (
            <div key={i} className="home-product-card">
              <div className="home-product-card-img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="home-product-card-body">
                <div className="home-product-card-name">{item.name}</div>
                <div className="home-product-card-price">{item.price}</div>
                <button
                  className="home-btn-cart"
                  onClick={() => handleAddToCart(item)}
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ NEW ARRIVALS ═════════════════════════════ */}
      <section className="home-new-arrivals">
        <div className="home-new-arrivals-badge">New arrivals</div>
        <HomeCarousel items={newArrivals} onAddToCart={handleAddToCart} hideInfo />
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

      {/* ══ FOOTER OSCURO ════════════════════════════ */}
      <SharedFooter />

    </div>
  )
}