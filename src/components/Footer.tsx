import './Footer.css'
import { Truck, CreditCard, Headphones } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-item">
        <Truck size={22} />
        <span>Fast shipping</span>
      </div>
      <div className="footer-item">
        <CreditCard size={22} />
        <span>Secure payments</span>
      </div>
      <div className="footer-item">
        <Headphones size={22} />
        <span>Customer support</span>
      </div>
    </footer>
  )
}

export default Footer