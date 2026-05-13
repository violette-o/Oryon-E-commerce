import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import './Categories.css'

import imgAirpodsMax from '../assets/AirpodsMax.png'
import imgIphone17   from '../assets/Iphone17ProMax.png'
import imgPowerBank  from '../assets/Powerbank.png'
import imgHomePod    from '../assets/Homepod.png'
import imgIpadMini   from '../assets/IpadMini.png'

const categories = [
  {
    id: 'headphones',
    name: 'Headphones',
    description: 'Wireless, noise-cancelling and studio headphones',
    img: imgAirpodsMax,
    path: '/categories/headphones',
  },
  {
    id: 'smartphones',
    name: 'Smartphones',
    description: 'Latest flagship and mid-range phones',
    img: imgIphone17,
    path: '/categories/smartphones',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Chargers, power banks, cables and more',
    img: imgPowerBank,
    path: '/categories/accessories',
  },
  {
    id: 'smartwatches',
    name: 'Smartwatches',
    description: 'Smart speakers, wearables and home devices',
    img: imgHomePod,
    path: '/categories/smartwatches',
  },
  {
    id: 'tablets',
    name: 'Tablets',
    description: 'iPads and Android tablets for work and play',
    img: imgIpadMini,
    path: '/categories/tablets',
  },
]

export default function Categories() {
  const navigate = useNavigate()

  return (
    <div className="categories-page">
      <Navbar />

      {/* ── Header ── */}
      <div className="categories-header">
        <h1>Categories</h1>
        <p>Browse our full collection by category</p>
      </div>

      {/* ── Grid ── */}
      <section className="categories-grid-section">
        <div className="categories-grid">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(cat.path)}
            >
              <div className="category-card-img">
                <img src={cat.img} alt={cat.name} />
              </div>
              <div className="category-card-body">
                <h2>{cat.name}</h2>
                <p>{cat.description}</p>
                <button className="category-btn">Shop now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}