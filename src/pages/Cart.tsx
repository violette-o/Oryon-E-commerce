import './Cart.css'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import SharedFooter from '../components/SharedFooter'
import Navbar from '../components/Navbar'
import imgPayments  from '../assets/Payment Options.png'

const TAX = 500

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

// ══════════════════════════════════════════════════════
export default function Cart() {
  const navigate  = useNavigate()
  const { items, removeItem, changeQty, total: subtotal } = useCart()

  const total = subtotal + TAX

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: '40px 0 8px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Shopping Cart</h1>
        <p style={{ fontSize: '14px', color: '#555', marginTop: '10px' }}>
          Review your selected products and proceed to checkout.
        </p>
      </div>

      {/* ── Continue Shopping ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 48px 0' }}>
        <span
          onClick={() => navigate('/')}
          style={{ fontSize: '13.5px', color: '#0abfb8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}
        >
          ← Continue Shopping
        </span>
      </div>

      {/* ── Main content ── */}
       <div className="cart-main">

        {/* ── Lista de items ── */}
        <div style={{
          background: '#f0f0f0', borderRadius: '16px', padding: '28px 24px',
          display: 'flex', flexDirection: 'column', gap: '28px',
        }}>
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {/* Imagen */}
                <div style={{
                  width: '100px', height: '100px', flexShrink: 0,
                  background: '#e0e0e0', borderRadius: '12px', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px',
                }}>
                  <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 4px' }}>{item.name}</p>
                  <p style={{ fontSize: '13px', color: '#555', margin: '0 0 12px' }}>{formatPrice(item.price)}</p>
                  <p style={{ fontSize: '12px', color: '#555', margin: '0 0 8px' }}>Quantity</p>

                  {/* Qty control */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    border: '1.5px solid #ccc', borderRadius: '8px', overflow: 'hidden',
                    background: '#fff',
                  }}>
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: '#333' }}
                    >−</button>
                    <span style={{ width: '36px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: '#333' }}
                    >+</button>
                  </div>

                  {/* Remove */}
                  <div style={{ marginTop: '10px' }}>
                    <span
                      onClick={() => removeItem(item.id)}
                      style={{ fontSize: '12.5px', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}
                    >
                      <X size={14} color="#e55" /> Remove
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Resumen ── */}
        <div style={{
          background: '#f0f0f0', borderRadius: '16px', padding: '28px 24px',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#333' }}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#333' }}>
            <span>Taxes</span>
            <span>{formatPrice(TAX)}</span>
          </div>
          <div style={{ height: '1px', background: '#ddd' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div style={{ flex: 1, minHeight: '40px' }} />

          <button
            onClick={() => navigate('/checkout')}
            style={{
              background: '#0abfb8', color: '#fff', border: 'none',
              borderRadius: '20px', padding: '12px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#089990')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0abfb8')}
          >
            Proceed to checkout.
          </button>
        </div>
      </div>

      {/* ── Medios de pago ── */}
      <div style={{
        borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0',
        display: 'flex', justifyContent: 'center', padding: '20px 48px',
        margin: '0 0 20px',
      }}>
        <img src={imgPayments} alt="Payment options" style={{ width: '100%', objectFit: 'contain' }} />
      </div>

      {/* ── Newsletter ── */}
      <section style={{ textAlign: 'center', padding: '48px 48px 60px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#1a1a1a' }}>
          Subscribe to our Newsletter!
        </h3>
        <p style={{ fontSize: '13px', color: '#555', marginBottom: '28px' }}>
          Stay updated with the latest products, exclusive offers, and technology news.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <input
  type="email" placeholder="Email"
  className="cart-newsletter-input"
  style={{
    border: '1.5px solid #ccc', borderRadius: '30px', padding: '13px 24px',
    fontSize: '13px', outline: 'none', fontFamily: 'Poppins, sans-serif',
  }}
/>
          <button style={{
            background: '#0abfb8', color: '#fff', border: 'none',
            borderRadius: '20px', padding: '11px 40px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
          }}>Send</button>
        </div>
      </section>

      {/* ── Footer oscuro ── */}
      <SharedFooter />
    </div>
  )
}