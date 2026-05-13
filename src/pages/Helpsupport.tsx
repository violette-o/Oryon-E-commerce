import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import './HelpSupport.css'

// ── FAQ data ───────────────────────────────────────────
const faqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days. Express shipping is available at checkout and takes 1-2 business days.',
  },
  {
    question: 'Can I return a product?',
    answer: 'Yes, you can return any product within 30 days of purchase as long as it is in its original condition and packaging.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is shipped, you will receive a confirmation email with a tracking number. You can also check your order status in My Orders.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, American Express, JCB, Discover, Diners Club and UnionPay.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes, all payments are encrypted and processed securely. We never store your card details on our servers.',
  },
  {
    question: 'Can I change or cancel my order?',
    answer: 'You can change or cancel your order within 1 hour of placing it. After that, the order goes into processing and cannot be modified.',
  },
]

// ── Shipping info ──────────────────────────────────────
const shippingInfo = [
  { label: 'Standard Shipping',  time: '3–5 business days', price: 'Free on orders over $500.000 COP' },
  { label: 'Express Shipping',   time: '1–2 business days', price: '$25.000 COP' },
  { label: 'Same Day Delivery',  time: 'Today (order before 12pm)', price: '$45.000 COP' },
]

// ── FAQ item ───────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        <span>{question}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <p className="faq-answer">{answer}</p>}
    </div>
  )
}

// ── Componente principal ───────────────────────────────
export default function HelpSupport() {
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'shipping'>('contact')
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)

  const handleSend = () => {
    if (!name || !email || !message) return
    setSent(true)
    setName(''); setEmail(''); setMessage('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="help-page">
      <Navbar />

      {/* Toast */}
      {sent && (
        <div className="help-toast">
          ✓ Message sent! We'll get back to you soon.
        </div>
      )}

      {/* Header */}
      <div className="help-header">
        <h1>Help & Support</h1>
        <p>We're here to help you with anything you need</p>
      </div>

      {/* Tabs */}
      <div className="help-tabs">
        <button
          className={`help-tab ${activeTab === 'contact' ? 'help-tab--active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
        <button
          className={`help-tab ${activeTab === 'faq' ? 'help-tab--active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </button>
        <button
          className={`help-tab ${activeTab === 'shipping' ? 'help-tab--active' : ''}`}
          onClick={() => setActiveTab('shipping')}
        >
          Shipping & Returns
        </button>
      </div>

      <section className="help-section">

        {/* ── CONTACT ── */}
        {activeTab === 'contact' && (
          <div className="help-contact">
            {/* Contact cards */}
            <div className="contact-cards">
              <div className="contact-card">
                <Mail size={24} className="contact-icon" />
                <h3>Email us</h3>
                <p>support@oryon.com</p>
                <span>Response within 24 hours</span>
              </div>
              <div className="contact-card">
                <Phone size={24} className="contact-icon" />
                <h3>Call us</h3>
                <p>+57 (1) 234 5678</p>
                <span>Mon–Fri, 9am–6pm</span>
              </div>
              <div className="contact-card">
                <MessageCircle size={24} className="contact-icon" />
                <h3>Live chat</h3>
                <p>Available on the app</p>
                <span>Mon–Sun, 8am–10pm</span>
              </div>
            </div>

            {/* Contact form */}
            <div className="contact-form-wrap">
              <h2>Send us a message</h2>
              <div className="contact-form">
                <div className="contact-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="contact-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="contact-field">
                  <label>Message</label>
                  <textarea
                    placeholder="How can we help you?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={5}
                  />
                </div>
                <button className="contact-send-btn" onClick={handleSend}>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {activeTab === 'faq' && (
          <div className="help-faq">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        )}

        {/* ── SHIPPING & RETURNS ── */}
        {activeTab === 'shipping' && (
          <div className="help-shipping">
            <h2>Shipping Options</h2>
            <div className="shipping-table">
              {shippingInfo.map((row, i) => (
                <div key={i} className="shipping-row">
                  <div className="shipping-label">{row.label}</div>
                  <div className="shipping-time">{row.time}</div>
                  <div className="shipping-price">{row.price}</div>
                </div>
              ))}
            </div>

            <h2 className="returns-title">Return Policy</h2>
            <div className="returns-card">
              <p>We want you to be completely satisfied with your purchase. If you are not happy with your order, you can return it within <strong>30 days</strong> of the delivery date.</p>
              <ul>
                <li>Items must be in original condition and packaging</li>
                <li>Include the receipt or proof of purchase</li>
                <li>Refunds are processed within 5–7 business days</li>
                <li>Shipping costs for returns are covered by the customer</li>
                <li>Defective or damaged items are fully covered by Oryon</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      <SharedFooter />
    </div>
  )
}