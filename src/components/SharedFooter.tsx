import { FaXTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6'
import logoClaro from '../assets/Logo Oryon claro.png'

export default function SharedFooter() {
  return (
    <footer style={{ background: '#111', color: '#aaa', padding: '50px 0 24px', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto 40px', padding: '0 80px',
        display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '40px',
      }}>
        <div>
          <img src={logoClaro} alt="Oryon" style={{ height: '32px', objectFit: 'contain', marginBottom: '12px', display: 'block' }} />
          <p style={{ fontSize: '12px', lineHeight: 1.75, color: '#777', maxWidth: '210px' }}>
            Oryon is a modern tech store offering innovative devices and accessories designed to improve the way you live, work, and connect.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {[
              { icon: <FaXTwitter size={13} />,    href: '#' },
              { icon: <FaFacebookF size={13} />,   href: '#' },
              { icon: <FaInstagram size={13} />,   href: '#' },
              { icon: <FaLinkedinIn size={13} />,  href: '#' },
            ].map((s, i) => (
              <a key={i} href={s.href} style={{
                width: '32px', height: '32px', borderRadius: '50%', background: '#222',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#aaa', textDecoration: 'none', transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#0abfb8'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#222'; (e.currentTarget as HTMLAnchorElement).style.color = '#aaa' }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        {[
          { title: 'COMPANY', links: ['About','Features','Works','Career'] },
          { title: 'HELP',    links: ['Customer Support','Delivery Details','Terms & Conditions','Privacy Policy'] },
          { title: 'FAQ',     links: ['Account','Manage Deliveries','Orders','Payments'] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ color: '#fff', fontSize: '12.5px', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.6px' }}>
              {col.title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.links.map(l => (
                <li key={l}>
                  <a href="#" style={{ fontSize: '12px', color: '#777', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#0abfb8'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#777'}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '18px 80px 0',
        borderTop: '1px solid #222', textAlign: 'center', fontSize: '11.5px', color: '#444',
      }}>
        © 2026 Oryon. All rights reserved. Designed for innovation, technology, and a better shopping experience.
      </div>
    </footer>
  )
}