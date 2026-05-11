import './SharedFooter.css'
import { FaXTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6'
import logoClaro from '../assets/Logo Oryon claro.png'

const socials = [
  { icon: <FaXTwitter size={13} />,   href: '#' },
  { icon: <FaFacebookF size={13} />,  href: '#' },
  { icon: <FaInstagram size={13} />,  href: '#' },
  { icon: <FaLinkedinIn size={13} />, href: '#' },
]

const columns = [
  { title: 'COMPANY', links: ['About', 'Features', 'Works', 'Career'] },
  { title: 'HELP',    links: ['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'] },
  { title: 'FAQ',     links: ['Account', 'Manage Deliveries', 'Orders', 'Payments'] },
]

export default function SharedFooter() {
  return (
    <footer className="shared-footer">
      <div className="shared-footer-grid">

        {/* Brand */}
        <div className="shared-footer-brand">
          <img src={logoClaro} alt="Oryon" className="shared-footer-logo" />
          <p className="shared-footer-desc">
            Oryon is a modern tech store offering innovative devices and accessories designed to improve the way you live, work, and connect.
          </p>
          <div className="shared-footer-socials">
            {socials.map((s, i) => (
              <a key={i} href={s.href} className="shared-footer-social">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Columns */}
        {columns.map(col => (
          <div key={col.title} className="shared-footer-col">
            <h4 className="shared-footer-col-title">{col.title}</h4>
            <ul className="shared-footer-col-list">
              {col.links.map(l => (
                <li key={l}>
                  <a href="#" className="shared-footer-col-link">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="shared-footer-bottom">
        © 2026 Oryon. All rights reserved. Designed for innovation, technology, and a better shopping experience.
      </div>
    </footer>
  )
}