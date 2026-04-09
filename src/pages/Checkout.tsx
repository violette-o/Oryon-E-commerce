import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'
import logoClaro   from '../assets/Logo Oryon claro.png'
import imgPayments from '../assets/Payment Options.png'

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

const DISCOUNT_RATE = 0.10
const TEAL      = '#0abfb8'
const TEAL_DARK = '#089990'
const DARK      = '#1a1a1a'
const MID       = '#555'
const CARD_BG   = '#f4f4f4'

// ── Stepper ────────────────────────────────────────────
const STEPS = ['Order', 'Shipping', 'Payment', 'Review']

function Stepper({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0 32px' }}>
      <div style={{ display: 'flex', gap: '80px', marginBottom: '12px' }}>
        {STEPS.map((s, i) => (
          <span key={s} style={{
            fontSize: '13.5px', fontWeight: i <= current ? 700 : 400,
            color: i <= current ? DARK : '#bbb',
            minWidth: '70px', textAlign: 'center',
          }}>{s}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: i <= current ? TEAL : '#ddd',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: i === current ? `0 0 0 4px rgba(10,191,184,0.2)` : 'none',
            }}>
              {i < current && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: '88px', height: '2px', background: i < current ? TEAL : '#ddd' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Input field ────────────────────────────────────────
function Field({ label, placeholder, value, onChange, half = false, type = 'text' }: {
  label: string; placeholder: string; value: string
  onChange: (v: string) => void; half?: boolean; type?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: half ? '0 0 calc(50% - 6px)' : '1 1 100%' }}>
      <label style={{ fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '0.5px' }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          border: `1.5px solid ${focused ? TEAL : '#e0e0e0'}`,
          borderRadius: '10px', padding: '11px 14px',
          fontSize: '13px', fontFamily: 'Poppins, sans-serif',
          outline: 'none', background: '#fff', color: DARK,
          transition: 'border-color 0.2s',
        }}
      />
    </div>
  )
}

// ══════════════════════════════════════════════════════
export default function Checkout() {
  const navigate = useNavigate()
  const { items, removeItem, changeQty, total: subtotal } = useCart()

  const discount = Math.round(subtotal * DISCOUNT_RATE)
  const total    = subtotal - discount

  const [cardNumber, setCardNumber] = useState('')
  const [cardName,   setCardName]   = useState('')
  const [expiry,     setExpiry]     = useState('')
  const [cvv,        setCvv]        = useState('')
  const [placing,    setPlacing]    = useState(false)
  const [done,       setDone]       = useState(false)

  const handleCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16)
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim())
  }
  const handleExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    setExpiry(d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d)
  }
  const handlePlaceOrder = () => {
    if (!cardNumber || !cardName || !expiry || !cvv) return
    setPlacing(true)
    setTimeout(() => { setPlacing(false); setDone(true) }, 1800)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />

      {/* Toast */}
      {done && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 999,
          background: TEAL, color: '#fff', padding: '14px 28px',
          borderRadius: '12px', fontSize: '13px', fontWeight: 600,
          boxShadow: '0 4px 20px rgba(10,191,184,0.35)',
        }}>
          ✓ Order placed successfully!
        </div>
      )}

      <Stepper current={2} />

      <div style={{
        maxWidth: '1000px', margin: '0 auto',
        padding: '0 48px 80px',
        display: 'grid', gridTemplateColumns: '1fr 340px',
        gap: '32px', alignItems: 'start',
      }}>

        {/* ══ LEFT ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Items */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: TEAL, margin: '0 0 16px' }}>
              Items <span style={{ fontWeight: 400 }}>({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            </h2>
            <div style={{ background: CARD_BG, borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {items.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#aaa', padding: '32px 0' }}>Your cart is empty.</p>
              ) : (
                // @ts-ignore
                items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '90px', height: '90px', flexShrink: 0,
                      background: '#e8e8e8', borderRadius: '14px', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px',
                    }}>
                      <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p style={{ fontSize: '13.5px', fontWeight: 600, color: DARK, margin: 0 }}>{item.name}</p>
                        <span onClick={() => removeItem(item.id)} style={{
                          fontSize: '12px', color: MID, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '12px', flexShrink: 0,
                        }}>
                          <X size={13} color="#e55" /> Remove
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: MID, margin: '4px 0 10px' }}>{formatPrice(item.price)}</p>
                      <p style={{ fontSize: '11.5px', color: '#aaa', margin: '0 0 6px' }}>Quantity</p>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center',
                        border: '1.5px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#fff',
                      }}>
                        <button onClick={() => changeQty(item.id, -1)} style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '17px', color: '#333' }}>−</button>
                        <span style={{ width: '32px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)} style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '17px', color: '#333' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order summary */}
          <div style={{ background: CARD_BG, borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: DARK, margin: '0 0 16px' }}>Order summary</h3>
            {[
              { label: 'Subtotal', value: formatPrice(subtotal), red: false },
              { label: 'Discount (10%)', value: `−${formatPrice(discount)}`, red: true },
              { label: 'Shipping', value: 'Free', red: false },
            ].map((row, i) => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: row.red ? '#e63946' : '#333', fontWeight: 500, padding: '10px 0' }}>
                  <span>{row.label}</span><span>{row.value}</span>
                </div>
                {i < 2 && <div style={{ height: '1px', background: '#e0e0e0' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: TEAL, margin: 0 }}>Checkout</h2>

          <div style={{ background: CARD_BG, borderRadius: '20px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Payment icons */}
            <div style={{ paddingBottom: '14px', borderBottom: '1px solid #e0e0e0' }}>
              <img src={imgPayments} alt="Payment options" style={{ width: '100%', height: '28px', objectFit: 'contain' }} />
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Field label="CARD NUMBER" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumber} />
              <Field label="CARDHOLDER NAME" placeholder="Name on card" value={cardName} onChange={setCardName} />
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Field label="EXPIRY DATE" placeholder="MM/YY" value={expiry} onChange={handleExpiry} half />
                <Field label="CVV" placeholder="···" value={cvv} onChange={v => setCvv(v.replace(/\D/g, '').slice(0, 4))} half type="password" />
              </div>
            </div>

            {/* Total + button */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: DARK, marginBottom: '16px' }}>
                <span>Total</span><span style={{ color: TEAL }}>{formatPrice(total)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing || done}
                style={{
                  width: '100%', background: done ? '#4caf7d' : TEAL,
                  color: '#fff', border: 'none', borderRadius: '20px',
                  padding: '13px', fontSize: '13px', fontWeight: 600,
                  cursor: placing || done ? 'default' : 'pointer',
                  fontFamily: 'Poppins, sans-serif', transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!placing && !done) e.currentTarget.style.background = TEAL_DARK }}
                onMouseLeave={e => { if (!placing && !done) e.currentTarget.style.background = done ? '#4caf7d' : TEAL }}
              >
                {done ? '✓ Order Placed!' : placing ? 'Processing…' : 'Place Order'}
              </button>
              <p onClick={() => navigate('/cart')} style={{ textAlign: 'center', fontSize: '12px', color: TEAL, cursor: 'pointer', margin: '12px 0 0' }}>
                ← Back to cart
              </p>
            </div>
          </div>

          <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', margin: 0 }}>
            🔒 Your payment info is encrypted and secure.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#111', color: '#aaa', padding: '50px 0 24px' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto 40px', padding: '0 80px',
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '40px',
        }}>
          <div>
            <img src={logoClaro} alt="Oryon" style={{ height: '32px', objectFit: 'contain', marginBottom: '12px', display: 'block' }} />
            <p style={{ fontSize: '12px', lineHeight: 1.75, color: '#777', maxWidth: '210px' }}>
              Oryon is a modern tech store offering innovative devices and accessories designed to improve the way you live, work, and connect.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {['𝕏','f','ig','in'].map(s => (
                <a key={s} href="#" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', textDecoration: 'none', fontSize: '12px' }}>{s}</a>
              ))}
            </div>
          </div>
          {[
            { title: 'COMPANY', links: ['About','Features','Works','Career'] },
            { title: 'HELP',    links: ['Customer Support','Delivery Details','Terms & Conditions','Privacy Policy'] },
            { title: 'FAQ',     links: ['Account','Manage Deliveries','Orders','Payments'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ color: '#fff', fontSize: '12.5px', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.6px' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map(l => (<li key={l}><a href="#" style={{ fontSize: '12px', color: '#777', textDecoration: 'none' }}>{l}</a></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '18px 80px 0', borderTop: '1px solid #222', textAlign: 'center', fontSize: '11.5px', color: '#444' }}>
          © 2026 Oryon. All rights reserved. Designed for innovation, technology, and a better shopping experience.
        </div>
      </footer>
    </div>
  )
}