import { useState, useEffect, useRef } from 'react'
import { Star, Eye, ShoppingBag, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import CommentSection from '../components/CommentSection'
import RatingSection from '../components/RatingSection'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getProductById } from '../services/products'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../services/products'
import imgPayments from '../assets/Payment Options.png'
import './ProductDetail.css'

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

function Stars({ filled, total = 5, size = 14 }: { filled: number; total?: number; size?: number }) {
  return (
    <>
      {Array.from({ length: total }, (_, i) => (
        <Star key={i} size={size} fill={i < filled ? 'currentColor' : 'none'} strokeWidth={i < filled ? 0 : 1.5} />
      ))}
    </>
  )
}

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
function ProductCard({ item, onAdded }: { item: Product; onAdded: (name: string) => void }) {
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const navigate       = useNavigate()

  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    item.name.length + item.price,
      name:  item.name,
      price: item.price,
      img:   item.images?.[0] ?? '',
    })
    onAdded(item.name)
  }

  return (
    <div className="product-card" onClick={() => navigate(`/product/${item.id}`)}>
      <div className="product-card-img">
        {item.images?.[0]
          ? <img src={item.images[0]} alt={item.name} />
          : <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
        }
      </div>
      <div className="product-card-body">
        <div className="product-card-name">{item.name}</div>
        <div className="product-card-price">{formatPrice(item.price)}</div>
        <button className="btn-cart-small" onClick={handleCart} aria-label="Add to cart">
          <ShoppingBag size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Carrusel ───────────────────────────────────────────
function Carousel({ items, onAdded }: { items: Product[]; onAdded: (name: string) => void }) {
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
        {items.map(c => <ProductCard key={c.id} item={c} onAdded={onAdded} />)}
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
  const { id }         = useParams<{ id: string }>()
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const navigate       = useNavigate()

  const [product,  setProduct]  = useState<Product | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [qty,      setQty]      = useState(1)
  const [added,    setAdded]    = useState<string | null>(null)
  const [time,     setTime]     = useState({ h: 0, m: 5, s: 59, ms: 47 })

  const { products } = useProducts()

  // Cargar producto desde Firestore
  useEffect(() => {
    if (!id) return
    setLoading(true)
    getProductById(id).then(p => {
      setProduct(p)
      setLoading(false)
    })
  }, [id])

  // Timer countdown
  const totalMsRef = useRef((5 * 60 + 59) * 1000 + 470)
  useEffect(() => {
    const interval = setInterval(() => {
      totalMsRef.current = Math.max(0, totalMsRef.current - 50)
      const t = totalMsRef.current
      setTime({
        h:  Math.floor(t / 3600000),
        m:  Math.floor((t % 3600000) / 60000),
        s:  Math.floor((t % 60000)   / 1000),
        ms: Math.floor((t % 1000)    / 10),
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  const showToast = (name: string) => {
    setAdded(name)
    setTimeout(() => setAdded(null), 2000)
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    if (!product) return
    addItem({ id: product.name.length + product.price, name: product.name, price: product.price, img: product.images?.[0] ?? '' })
    showToast(product.name)
  }

  // Productos relacionados
  const related = products.filter(p => p.id !== id && p.category === product?.category).slice(0, 4)
  const others  = products.filter(p => p.id !== id).slice(0, 4)

  if (loading) {
    return (
      <div className="pd-page">
        <Navbar />
        <p style={{ textAlign: 'center', padding: '80px 0', color: '#aaa', fontFamily: 'Poppins' }}>Loading product...</p>
        <SharedFooter />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pd-page">
        <Navbar />
        <p style={{ textAlign: 'center', padding: '80px 0', color: '#888', fontFamily: 'Poppins' }}>
          Product not found. <span style={{ color: '#0abfb8', cursor: 'pointer' }} onClick={() => navigate('/')}>← Go back</span>
        </p>
        <SharedFooter />
      </div>
    )
  }

  return (
    <div className="pd-page">
      <Navbar />
      {added && <Toast name={added} />}

      <section className="product-section">
        <div className="product-info">
          <h1>
            {product.name}
            <button className="wish-btn" aria-label="Add to wishlist"><Heart size={18} /></button>
          </h1>
          <div className="rating-row">
            <span className="stars"><Stars filled={4} /></span>
            <span className="rating-count">(0)</span>
          </div>
          <div className="price-row">
            <span className="price-current">{formatPrice(product.price)}</span>
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
          <p className="product-desc">{product.description}</p>
          <div className="stock-row">
            <div className="stock-label"><span>Condition: {product.condition}</span></div>
            <div className="progress-bar"><div className="progress-fill" /></div>
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
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} />
            : <div style={{ width: '100%', height: '400px', background: '#f5f5f5', borderRadius: '16px' }} />
          }
        </div>
      </section>

      <div className="payment-row">
        <img src={imgPayments} alt="Payment options" style={{ width: '100%', objectFit: 'contain' }} />
      </div>

      {related.length > 0 && (
        <section className="carousel-section">
          <h2>You may also like</h2>
          <Carousel items={related} onAdded={showToast} />
        </section>
      )}

      {others.length > 0 && (
        <div className="dark-section">
          <div className="inner">
            <h2>Customers also viewed</h2>
            <Carousel items={others} onAdded={showToast} />
          </div>
        </div>
      )}

      <section className="newsletter-section">
        <h3>Subscribe to our Newsletter!</h3>
        <p>Stay updated with the latest products, exclusive offers, and technology news.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Email" />
          <button className="btn-send">Send</button>
        </div>
      </section>

      <section className="pd-comments">
        <CommentSection productId={id ?? ''} />
      </section>

      <section className="pd-ratings">
        <RatingSection productId={id ?? ''} />
      </section>

      <SharedFooter />
    </div>
  )
}