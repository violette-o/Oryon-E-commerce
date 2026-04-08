import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import './Home.css'

// ── Assets ─────────────────────────────────────────────
import logoClaro        from '../assets/Logo Oryon claro.png'
import imgIphoneHero    from '../assets/Iphone Hero.png'
import imgIphoneGrid    from '../assets/Iphone Grid.png'
import imgAudifMax      from '../assets/Audifonos negros airpods max.png'
import imgAirpods       from '../assets/Airpods.png'
import imgIpad          from '../assets/ipad.png'
import imgIpadMini      from '../assets/IpadMini.png'
import imgAirpodsGreen  from '../assets/airpodsmaxgreen.png'
import imgAirpodsBlack  from '../assets/airpodsmaxblack.webp'
import imgAirpodsPro3   from '../assets/AirPodsPro3.png'
import imgSamsungPods   from '../assets/Samsungpods.png'
import imgMsiLaptop     from '../assets/msilaptop.webp'

// ── Tipos ──────────────────────────────────────────────
interface Product {
  name: string
  price: string
  img: string
  path?: string
}

// ── Datos ──────────────────────────────────────────────
const bestSellers: Product[] = [
  { name: 'Headphones SAMSUNG', price: '$300.000 COP', img: imgAirpodsGreen,  path: '/product' },
  { name: 'Apple Ipad mini 256gb', price: '$ 2.200.000 COP', img: imgIpadMini, path: '/product' },
]

const featured: Product[] = [
  { name: 'Headphones SAMSUNG', price: '$3.100.000 COP', img: imgSamsungPods,  path: '/product' },
  { name: 'APPLE iPad Mini',    price: '$2.200.000 COP', img: imgIpadMini,     path: '/product' },
  { name: 'APPLE Airbuds Pro',  price: '$1.100.000 COP', img: imgAirpodsPro3,  path: '/product' },
]

const newArrivals: Product[] = [
  { name: 'Power Bank Pro',     price: '$180.000 COP',   img: imgAirpodsBlack, path: '/product' },
  { name: 'AirPods Max Black',  price: '$2.700.000 COP', img: imgAirpodsBlack, path: '/product' },
  { name: 'iPhone 15 Pro',      price: '$5.200.000 COP', img: imgIphoneHero,   path: '/product' },
  { name: 'iPad mini 256gb',    price: '$2.200.000 COP', img: imgIpadMini,     path: '/product' },
]

const categories = [
  { name: 'Headphones', image: imgAudifMax,   path: '/product' },
  { name: 'AirPods',    image: imgAirpods,    path: '/product' },
  { name: 'iPad',       image: imgIpad,       path: '/product' },
  { name: 'iPhone',     image: imgIphoneGrid, path: '/product' },
]

// ── Sub-componente: carrusel ───────────────────────────
function HomeCarousel({ items, onAddToCart, visibleCount = 3 }: { items: Product[]; onAddToCart: (item: Product) => void; visibleCount?: number }) {
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
          <div key={i} className="home-product-card">
            <div className="home-product-card-img">
              <img src={item.img} alt={item.name} />
            </div>
            <div className="home-product-card-body">
              <div className="home-product-card-name">{item.name}</div>
              <div className="home-product-card-price">{item.price}</div>
              <button
                className="home-btn-cart"
                onClick={() => onAddToCart(item)}
                aria-label="Add to cart"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
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
  const navigate = useNavigate()

  // Si no está logueado → redirige al login
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login')
    } else {
      // lógica real del carrito aquí
      alert('Added to cart!')
    }
  }

  return (
    <div className="home-page">
      <Navbar />

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
        {categories.map((cat, i) => (
          <div
            key={cat.name}
            className="home-category-card"
            onClick={() => i === 0 ? navigate('/product') : undefined}
            style={{ cursor: i === 0 ? 'pointer' : 'default' }}
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
        <HomeCarousel items={bestSellers} onAddToCart={handleAddToCart} visibleCount={2} />
      </section>

      {/* ══ PROMO BANNER ═════════════════════════════ */}
      <section className="home-promo-banner">
        <img src={imgMsiLaptop} alt="Laptop" className="home-promo-img" />
        <div className="home-promo-text">
          <h2>Exclusive tech deals.</h2>
          <p>Don't miss out.</p>
          <button className="home-promo-btn" onClick={() => navigate('/product')}>Shop now</button>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ════════════════════════ */}
      <section className="home-section">
        <h2 className="home-section-title">Freatured Products</h2>
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
                  onClick={handleAddToCart}
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
      <section className="home-section home-new-arrivals">
        <div className="home-new-arrivals-badge">New arrivals</div>
        <HomeCarousel items={newArrivals} onAddToCart={handleAddToCart} />
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
      <footer className="home-footer">
        <div className="home-footer-grid">
          <div className="home-footer-brand">
            <div className="home-footer-logo">
              <img src={logoClaro} alt="Oryon" />
            </div>
            <p>Oryon is a modern tech store offering innovative devices and accessories designed to improve the way you live, work, and connect.</p>
            <div className="home-footer-socials">
              <a href="#" className="home-footer-social">𝕏</a>
              <a href="#" className="home-footer-social">f</a>
              <a href="#" className="home-footer-social">ig</a>
              <a href="#" className="home-footer-social">in</a>
            </div>
          </div>
          <div className="home-footer-col">
            <h4>COMPANY</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Works</a></li>
              <li><a href="#">Career</a></li>
            </ul>
          </div>
          <div className="home-footer-col">
            <h4>HELP</h4>
            <ul>
              <li><a href="#">Customer Support</a></li>
              <li><a href="#">Delivery Details</a></li>
              <li><a href="#">Terms &amp; Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="home-footer-col">
            <h4>FAQ</h4>
            <ul>
              <li><a href="#">Account</a></li>
              <li><a href="#">Manage Deliveries</a></li>
              <li><a href="#">Orders</a></li>
              <li><a href="#">Payments</a></li>
            </ul>
          </div>
        </div>
        <div className="home-footer-bottom">
          © 2025 Oryon. All rights reserved. Designed for innovation, technology, and a better shopping experience.
        </div>
      </footer>
    </div>
  )
}