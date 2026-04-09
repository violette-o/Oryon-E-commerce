import { useState, useEffect, useRef } from 'react'
import {
  Star, Eye, ShoppingBag, ChevronLeft, ChevronRight, Heart
} from 'lucide-react'
import { FaXTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './ProductDetail.css'

import logoClaro          from '../assets/Logo Oryon claro.png'
import imgAirpodsMaxBlack from '../assets/airpodsmaxblack.webp'
import imgAirpodsMaxGreen from '../assets/airpodsmaxgreen.png'
import imgAirpodsPro3     from '../assets/AirPodsPro3.png'
import imgSamsungPods     from '../assets/Samsungpods.png'
import imgSamsungBuds3    from '../assets/samsunggalaxybuds3.webp'
import imgSmokinBuds      from '../assets/smokinbuds.webp'
import imgIpadMini        from '../assets/IpadMini.png'
import imgMsiLaptop       from '../assets/msilaptop.webp'
import imgMsiLaptop2      from '../assets/msilaptop2.png'
import imgSonyWH          from '../assets/sony-wh-1000xm6.png'
import imgMbpSilver       from '../assets/mbpsilver.png'
import imgPayments        from '../assets/Payment Options.png'
import chica1             from '../assets/chica1.jpg'
import chica2             from '../assets/chica2.jpg'
import chica3             from '../assets/chica3.jpeg'
import chico1             from '../assets/chico1.jpeg'

const imgProductoMain = imgSamsungPods

interface CardData {
  name: string; price: string; img: string; alt: string; badge?: string
}

const alsoLike: CardData[] = [
  { name: 'Headphones SAMSUNG',    price: '$300.000 COP',   img: imgAirpodsMaxGreen, alt: 'Headphones SAMSUNG' },
  { name: 'APPLE AirPods Max',     price: '$2.700.000 COP', img: imgAirpodsMaxBlack, alt: 'APPLE AirPods Max'  },
  { name: 'SONY WH-1000XM6',       price: '$1.600.000 COP', img: imgSonyWH,          alt: 'SONY WH-1000XM6'   },
]
const elevate: CardData[] = [
  { name: 'APPLE AirPods Pro 3',   price: '$1.170.000 COP', img: imgAirpodsPro3,  alt: 'AirPods Pro 3'         },
  { name: 'SAMSUNG Galaxy Buds 3', price: '$720.000 COP',   img: imgSamsungBuds3, alt: 'Samsung Galaxy Buds 3' },
  { name: 'SKULLCANDY Buds®',      price: '$120.000 COP',   img: imgSmokinBuds,   alt: 'Skullcandy Buds'       },
]
const alsoViewed: CardData[] = [
  { name: 'MacBook Pro M2',        price: '$5.200.000 COP', img: imgMbpSilver,  alt: 'MacBook Pro M2',    badge: 'SAVE 12%' },
  { name: 'Portatil MSI Thin Amd', price: '$3.800.000 COP', img: imgMsiLaptop,  alt: 'MSI Thin'                             },
  { name: 'APPLE Ipad mini 256gb', price: '$2.200.000 COP', img: imgIpadMini,   alt: 'APPLE iPad mini'                      },
  { name: 'MSI Cyborg 15 A13VFF',  price: '$5.299.999 COP', img: imgMsiLaptop2, alt: 'MSI Cyborg'                           },
]

const colorMap: Record<string, string> = { black: 'Black', navy: 'Navy Blue', white: 'White' }

function Stars({ filled, total = 5, size = 14 }: { filled: number; total?: number; size?: number }) {
  return (
    <>
      {Array.from({ length: total }, (_, i) => (
        <Star key={i} size={size} fill={i < filled ? 'currentColor' : 'none'} strokeWidth={i < filled ? 0 : 1.5} />
      ))}
    </>
  )
}

// ── Toast global ───────────────────────────────────────
function Toast({ name }: { name: string }) {
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '24px', zIndex: 999,
      background: '#0abfb8', color: '#fff', padding: '12px 24px',
      borderRadius: '12px', fontSize: '13px', fontWeight: 600,
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    }}>
      ✓ {name} added to cart!
    </div>
  )
}

// ── Tarjeta ────────────────────────────────────────────
function ProductCard({ card, onAdded }: { card: CardData; onAdded: (name: string) => void }) {
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const navigate       = useNavigate()

  const handleCart = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    card.name.length + card.price.length,
      name:  card.name,
      price: parseInt(card.price.replace(/[^0-9]/g, '')),
      img:   card.img,
    })
    onAdded(card.name)
  }

  return (
    <div className="product-card">
      <div className="product-card-img">
        {card.badge && <span className="badge-save-sm">{card.badge}</span>}
        <img src={card.img} alt={card.alt} />
      </div>
      <div className="product-card-body">
        <div className="product-card-name">{card.name}</div>
        <div className="product-card-price">{card.price}</div>
        <button className="btn-cart-small" onClick={handleCart} aria-label="Add to cart">
          <ShoppingBag size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Carrusel ───────────────────────────────────────────
function Carousel({ items, onAdded }: { items: CardData[]; onAdded: (name: string) => void }) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const visible = 3
  const max = Math.max(0, items.length - visible)

  const goTo = (newIndex: number) => {
    if (!trackRef.current) return
    const card = trackRef.current.children[0] as HTMLElement
    trackRef.current.scrollLeft = newIndex * (card.offsetWidth + 20)
    setIndex(newIndex)
  }

  return (
    <div className="carousel-wrapper">
      {index > 0 && (
        <button className="carousel-arrow left" onClick={() => goTo(index - 1)}>
          <ChevronLeft size={16} />
        </button>
      )}
      <div ref={trackRef} className="carousel-track">
        {items.map(c => <ProductCard key={c.name} card={c} onAdded={onAdded} />)}
      </div>
      {index < max && (
        <button className="carousel-arrow right" onClick={() => goTo(index + 1)}>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════
export default function ProductDetail() {
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const navigate       = useNavigate()

  const [qty,   setQty]   = useState(1)
  const [color, setColor] = useState('black')
  const [time,  setTime]  = useState({ h: 0, m: 5, s: 59, ms: 47 })
  const [added, setAdded] = useState<string | null>(null)

  const totalMsRef = useRef((5 * 60 + 59) * 1000 + 470)
  useEffect(() => {
    const id = setInterval(() => {
      totalMsRef.current = Math.max(0, totalMsRef.current - 50)
      const t = totalMsRef.current
      setTime({
        h:  Math.floor(t / 3600000),
        m:  Math.floor((t % 3600000) / 60000),
        s:  Math.floor((t % 60000)   / 1000),
        ms: Math.floor((t % 1000)    / 10),
      })
    }, 50)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  const showToast = (name: string) => {
    setAdded(name)
    setTimeout(() => setAdded(null), 2000)
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({ id: 1, name: 'Headphones Samsung', price: 2077000, img: imgProductoMain })
    showToast('Headphones Samsung')
  }

  return (
    <div className="pd-page">
      <Navbar />
      {added && <Toast name={added} />}

      <section className="product-section">
        <div className="product-info">
          <h1>
            Headphones Samsung
            <button className="wish-btn" aria-label="Add to wishlist"><Heart size={18} /></button>
          </h1>
          <div className="rating-row">
            <span className="stars"><Stars filled={4} /></span>
            <span className="rating-count">(4)</span>
          </div>
          <div className="price-row">
            <span className="badge-save">SAVE 33%</span>
            <span className="price-current">$2.077.000</span>
            <span className="price-old">$3.100.000</span>
          </div>
          <div className="timer-box">
            {[
              { val: pad(time.h),  lbl: 'Hrs' },
              { val: pad(time.m),  lbl: 'Min' },
              { val: pad(time.s),  lbl: 'Seg' },
              { val: pad(time.ms), lbl: 'Ms'  },
            ].map((unit, i, arr) => (
              <span key={i} style={{ display: 'contents' }}>
                <div className="timer-unit">
                  <div className="num">{unit.val}</div>
                  <div className="lbl">{unit.lbl}</div>
                </div>
                {i < arr.length - 1 && <span className="timer-sep">:</span>}
              </span>
            ))}
          </div>
          <div className="viewers"><Eye size={14} />24 people are viewing this right now</div>
          <p className="product-desc">
            Experience powerful sound wherever you go with these incredible Samsung headphones.
            Designed for comfort and performance, they're the perfect way to enjoy your music,
            calls, and entertainment in style.
          </p>
          <div className="stock-row">
            <div className="stock-label"><span>Only 9 item(s) left in stock!</span></div>
            <div className="progress-bar"><div className="progress-fill" /></div>
          </div>
          <div className="color-row">
            <div className="color-label">Color: {colorMap[color]}</div>
            <div className="color-dots">
              {['black', 'navy', 'white'].map(c => (
                <div key={c} className={`color-dot ${c}${color === c ? ' active' : ''}`} onClick={() => setColor(c)} />
              ))}
            </div>
          </div>
          <div className="cart-row">
            <div className="qty-label">Quantity</div>
            <div className="qty-actions">
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(9, q + 1))}>+</button>
              </div>
              <button className="btn-addcart" onClick={handleAddToCart}>Add to cart</button>
            </div>
          </div>
        </div>
        <div className="product-image-wrap">
          <img src={imgProductoMain} alt="Samsung Headphones" />
        </div>
      </section>

      <div className="divider" />
      <section className="reviews-section">
        <h2>Consumer reviews</h2>
        <div className="reviews-grid">
          <div className="reviews-summary">
            <div className="score-big">4.0</div>
            <div className="score-stars"><Stars filled={4} size={18} /></div>
            <div className="score-count">(4)</div>
            {[
              { name: 'Feature rating', filled: 4 },
              { name: 'Battery life',   filled: 3 },
              { name: 'Connectivity',   filled: 3 },
              { name: 'Sound quality',  filled: 4 },
              { name: 'Comfort',        filled: 3 },
            ].map(c => (
              <div className="criteria-row" key={c.name}>
                <div className="criteria-name">{c.name}</div>
                <div className="criteria-stars"><Stars filled={c.filled} size={13} /></div>
              </div>
            ))}
          </div>
          <div className="reviews-list">
            {[
              { text: "The sound quality is amazing and the bass is really powerful. I use them every day for music and calls, and they're super comfortable even after hours.", stars: 5, avatar: chica1 },
              { text: "I was surprised by how clear the audio is. The design looks sleek and they feel very lightweight. Definitely worth the price.", stars: 4, avatar: chica2 },
              { text: "They work well for music and calls. The battery lasts a decent amount of time, but I wish the ear cushions were a little softer.", stars: 4, avatar: chica3 },
              { text: "Overall they're good headphones for the price. The sound is balanced and the build quality feels nice, even if they're not super premium.", stars: 4, avatar: chico1 },
            ].map((r, i) => (
              <div className="review-card" key={i}>
                <div className="reviewer-avatar"><img src={r.avatar} alt="reviewer" /></div>
                <div>
                  <p className="review-text">{r.text}</p>
                  <div className="review-stars"><Stars filled={r.stars} size={12} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="payment-row">
        <img src={imgPayments} alt="Payment options" style={{ width: '100%', objectFit: 'contain' }} />
      </div>

      <section className="carousel-section">
        <h2>You may also like</h2>
        <Carousel items={alsoLike} onAdded={showToast} />
      </section>
      <section className="carousel-section" style={{ marginTop: '10px' }}>
        <h2>Elevate your experience with this options</h2>
        <Carousel items={elevate} onAdded={showToast} />
      </section>

      <div className="dark-section">
        <div className="inner">
          <h2>Customers who viewed products in your search history also viewed</h2>
          <Carousel items={alsoViewed} onAdded={showToast} />
        </div>
      </div>

      <section className="newsletter-section">
        <h3>Subscribe to our Newsletter!</h3>
        <p>Stay updated with the latest products, exclusive offers, and technology news.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Email" />
          <button className="btn-send">Send</button>
        </div>
      </section>

      <footer className="pd-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo"><img src={logoClaro} alt="Oryon" /></div>
            <p>Oryon is a modern tech store offering innovative devices and accessories designed to improve the way you live, work, and connect.</p>
            <div className="footer-socials">
              <a href="#" className="footer-social-icon"><FaXTwitter size={13} /></a>
              <a href="#" className="footer-social-icon"><FaFacebookF size={13} /></a>
              <a href="#" className="footer-social-icon"><FaInstagram size={13} /></a>
              <a href="#" className="footer-social-icon"><FaLinkedinIn size={13} /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>COMPANY</h4>
            <ul><li><a href="#">About</a></li><li><a href="#">Features</a></li><li><a href="#">Works</a></li><li><a href="#">Career</a></li></ul>
          </div>
          <div className="footer-col">
            <h4>HELP</h4>
            <ul><li><a href="#">Customer Support</a></li><li><a href="#">Delivery Details</a></li><li><a href="#">Terms &amp; Conditions</a></li><li><a href="#">Privacy Policy</a></li></ul>
          </div>
          <div className="footer-col">
            <h4>FAQ</h4>
            <ul><li><a href="#">Account</a></li><li><a href="#">Manage Deliveries</a></li><li><a href="#">Orders</a></li><li><a href="#">Payments</a></li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 Oryon. All rights reserved. Designed for innovation, technology, and a better shopping experience.
        </div>
      </footer>
    </div>
  )
}