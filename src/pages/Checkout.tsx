import './Checkout.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import SharedFooter from '../components/SharedFooter'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'
import imgPayments from '../assets/Payment Options.png'

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

const DISCOUNT_RATE = 0.10
const STEPS = ['Order', 'Shipping', 'Payment', 'Review']

// ── Stepper ────────────────────────────────────────────
function Stepper({ current }: { current: number }) {
  return (
    <div className="stepper">
      <div className="stepper-labels">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`stepper-label ${i <= current ? 'stepper-label--active' : ''}`}
          >
            {s}
          </span>
        ))}
      </div>
      <div className="stepper-dots">
        {STEPS.map((s, i) => (
          <div key={s} className="stepper-step">
            <div className={`stepper-dot ${i <= current ? 'stepper-dot--active' : ''} ${i === current ? 'stepper-dot--current' : ''}`}>
              {i < current && <span className="stepper-check">✓</span>}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`stepper-line ${i < current ? 'stepper-line--active' : ''}`} />
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
    <div className={`checkout-field ${half ? 'checkout-field--half' : ''}`}>
      <label className="checkout-field-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`checkout-field-input ${focused ? 'checkout-field-input--focused' : ''}`}
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
    setTimeout(() => {
  setPlacing(false)
  setDone(true)
  navigate('/review')
}, 1800)
  }

  return (
    <div className="checkout-page">
      <Navbar />

      {/* Toast */}
      {done && (
        <div className="checkout-toast">
          ✓ Order placed successfully!
        </div>
      )}

      <Stepper current={2} />

      <div className="checkout-main">

        {/* ══ LEFT ══ */}
        <div className="checkout-left">

          {/* Items */}
          <div>
            <h2 className="checkout-section-title">
              Items <span className="checkout-section-count">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            </h2>
            <div className="checkout-items-list">
              {items.length === 0 ? (
                <p className="checkout-empty">Your cart is empty.</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item-img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="checkout-item-info">
                      <div className="checkout-item-header">
                        <p className="checkout-item-name">{item.name}</p>
                        <span className="checkout-item-remove" onClick={() => removeItem(item.id)}>
                          <X size={13} color="#e55" /> Remove
                        </span>
                      </div>
                      <p className="checkout-item-price">{formatPrice(item.price)}</p>
                      <p className="checkout-item-qty-label">Quantity</p>
                      <div className="checkout-qty-control">
                        <button onClick={() => changeQty(item.id, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="checkout-summary">
            <h3 className="checkout-summary-title">Order summary</h3>
            {[
              { label: 'Subtotal',       value: formatPrice(subtotal),          red: false },
              { label: 'Discount (10%)', value: `−${formatPrice(discount)}`,    red: true  },
              { label: 'Shipping',       value: 'Free',                         red: false },
            ].map((row, i) => (
              <div key={row.label}>
                <div className={`checkout-summary-row ${row.red ? 'checkout-summary-row--red' : ''}`}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
                {i < 2 && <div className="checkout-summary-divider" />}
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="checkout-right">
          <h2 className="checkout-section-title checkout-section-title--right">Checkout</h2>

          <div className="checkout-card">
            {/* Payment icons */}
            <div className="checkout-payment-icons">
              <img src={imgPayments} alt="Payment options" />
            </div>

            {/* Form */}
            <div className="checkout-form">
              <Field label="CARD NUMBER" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumber} />
              <Field label="CARDHOLDER NAME" placeholder="Name on card" value={cardName} onChange={setCardName} />
              <div className="checkout-form-row">
                <Field label="EXPIRY DATE" placeholder="MM/YY" value={expiry} onChange={handleExpiry} half />
                <Field label="CVV" placeholder="···" value={cvv} onChange={v => setCvv(v.replace(/\D/g, '').slice(0, 4))} half type="password" />
              </div>
            </div>

            {/* Total + button */}
            <div className="checkout-total-section">
              <div className="checkout-total-row">
                <span>Total</span>
                <span className="checkout-total-value">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing || done}
                className={`checkout-place-btn ${done ? 'checkout-place-btn--done' : ''}`}
              >
                {done ? '✓ Order Placed!' : placing ? 'Processing…' : 'Place Order'}
              </button>
              <p className="checkout-back" onClick={() => navigate('/cart')}>
                ← Back to cart
              </p>
            </div>
          </div>

          <p className="checkout-secure">🔒 Your payment info is encrypted and secure.</p>
        </div>
      </div>

      <SharedFooter />
    </div>
  )
}