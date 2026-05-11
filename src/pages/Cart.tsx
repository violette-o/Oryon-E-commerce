import './Cart.css'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import SharedFooter from '../components/SharedFooter'
import Navbar from '../components/Navbar'
import imgPayments from '../assets/Payment Options.png'

const TAX = 500

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

// ══════════════════════════════════════════════════════
export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, changeQty, total: subtotal } = useCart()

  const total = subtotal + TAX

  return (
    <div className="cart-page">
      <Navbar />

      {/* ── Header ── */}
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <p className="cart-subtitle">Review your selected products and proceed to checkout.</p>
      </div>

      {/* ── Continue Shopping ── */}
      <div className="cart-continue-wrapper">
        <span className="cart-continue" onClick={() => navigate('/')}>
          ← Continue Shopping
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="cart-main">

        {/* ── Lista de items ── */}
        <div className="cart-items-list">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                {/* Imagen */}
                <div className="cart-item-img">
                  <img src={item.img} alt={item.name} />
                </div>

                {/* Info */}
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                  <p className="cart-item-qty-label">Quantity</p>

                  {/* Qty control */}
                  <div className="cart-qty-control">
                    <button onClick={() => changeQty(item.id, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>

                  {/* Remove */}
                  <div className="cart-item-remove" onClick={() => removeItem(item.id)}>
                    <X size={14} color="#e55" /> Remove
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Resumen ── */}
        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Taxes</span>
            <span>{formatPrice(TAX)}</span>
          </div>
          <div className="cart-summary-divider" />
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="cart-summary-spacer" />

          <button className="cart-checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to checkout.
          </button>
        </div>
      </div>

      {/* ── Medios de pago ── */}
      <div className="cart-payments">
        <img src={imgPayments} alt="Payment options" />
      </div>

      {/* ── Newsletter ── */}
      <section className="cart-newsletter">
        <h3 className="cart-newsletter-title">Subscribe to our Newsletter!</h3>
        <p className="cart-newsletter-sub">
          Stay updated with the latest products, exclusive offers, and technology news.
        </p>
        <div className="cart-newsletter-form">
          <input type="email" placeholder="Email" className="cart-newsletter-input" />
          <button className="cart-newsletter-btn">Send</button>
        </div>
      </section>

      {/* ── Footer oscuro ── */}
      <SharedFooter />
    </div>
  )
}