import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './NewArrivals.css'

import imgIphone17     from '../assets/Iphone17ProMax.png'
import imgAirpodsMax   from '../assets/AirpodsMax.png'
import imgPowerBank    from '../assets/Powerbank.png'
import imgJBL          from '../assets/JBL.png'
import imgHomePod      from '../assets/Homepod.png'
import imgJBLClip      from '../assets/JBLClip.png'
import imgAirpodsPro3  from '../assets/AirPodsPro3.png'
import imgIpadMini     from '../assets/IpadMini.png'

interface Product {
  id: number
  name: string
  price: string
  img: string
  isNew?: boolean
}

const newArrivals: Product[] = [
  { id: 1, name: 'iPhone 17 Pro Max',     price: '$5.400.000 COP', img: imgIphone17,    isNew: true  },
  { id: 2, name: 'AirPods Max',           price: '$2.700.000 COP', img: imgAirpodsMax,  isNew: true  },
  { id: 3, name: 'Power Bank Pro',        price: '$180.000 COP',   img: imgPowerBank,   isNew: true  },
  { id: 4, name: 'JBL Speaker',           price: '$2.150.000 COP', img: imgJBL,         isNew: true  },
  { id: 5, name: 'HomePod',              price: '$899.000 COP',   img: imgHomePod,     isNew: true  },
  { id: 6, name: 'JBL Clip',             price: '$350.000 COP',   img: imgJBLClip,     isNew: false },
  { id: 7, name: 'AirPods Pro 3',        price: '$1.100.000 COP', img: imgAirpodsPro3, isNew: false },
  { id: 8, name: 'Apple iPad Mini 256gb',price: '$2.200.000 COP', img: imgIpadMini,    isNew: false },
]

export default function NewArrivals() {
  const navigate       = useNavigate()
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const handleAddToCart = (item: Product) => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    item.id,
      name:  item.name,
      price: parseInt(item.price.replace(/[^0-9]/g, '')),
      img:   item.img,
    })
    setAdded(item.name)
    setTimeout(() => setAdded(null), 2000)
  }

  return (
    <div className="newarrivals-page">
      <Navbar />

      {added && (
        <div className="newarrivals-toast">
          ✓ {added} added to cart!
        </div>
      )}

      {/* Header */}
      <div className="newarrivals-header">
        <h1>New Arrivals</h1>
        <p>The latest products just landed</p>
      </div>

      {/* Grid */}
      <section className="newarrivals-section">
        <div className="newarrivals-grid">
          {newArrivals.map(item => (
            <div key={item.id} className="newarrivals-card">
              {item.isNew && (
                <div className="newarrivals-badge">NEW</div>
              )}
              <div className="newarrivals-card-img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="newarrivals-card-body">
                <p className="newarrivals-card-name">{item.name}</p>
                <p className="newarrivals-card-price">{item.price}</p>
                <button
                  className="newarrivals-btn-cart"
                  onClick={() => handleAddToCart(item)}
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}