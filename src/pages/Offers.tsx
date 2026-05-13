import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Offers.css'

import imgSamsungPods  from '../assets/Samsungpods.png'
import imgIpadMini     from '../assets/IpadMini.png'
import imgAirpodsPro3  from '../assets/AirPodsPro3.png'
import imgIphone17     from '../assets/Iphone17ProMax.png'
import imgAirpodsMax   from '../assets/AirpodsMax.png'
import imgSonyBlack    from '../assets/SonyBlack.png'
import imgJBLClip      from '../assets/JBLClip.png'
import imgPowerBank    from '../assets/Powerbank.png'

interface OfferProduct {
  id: number
  name: string
  originalPrice: number
  salePrice: number
  discount: number
  img: string
}

const offers: OfferProduct[] = [
  { id: 1,  name: 'Headphones Samsung',    originalPrice: 3100000, salePrice: 2077000, discount: 33, img: imgSamsungPods  },
  { id: 2,  name: 'Apple iPad Mini 256gb', originalPrice: 2800000, salePrice: 2200000, discount: 21, img: imgIpadMini     },
  { id: 3,  name: 'AirPods Pro 3',         originalPrice: 1500000, salePrice: 1100000, discount: 27, img: imgAirpodsPro3  },
  { id: 4,  name: 'iPhone 17 Pro Max',     originalPrice: 6500000, salePrice: 5400000, discount: 17, img: imgIphone17     },
  { id: 5,  name: 'AirPods Max',           originalPrice: 3500000, salePrice: 2700000, discount: 23, img: imgAirpodsMax   },
  { id: 6,  name: 'Headphones Sony',       originalPrice: 1800000, salePrice: 1300000, discount: 28, img: imgSonyBlack    },
  { id: 7,  name: 'JBL Clip',              originalPrice: 500000,  salePrice: 350000,  discount: 30, img: imgJBLClip      },
  { id: 8,  name: 'Power Bank Pro',        originalPrice: 250000,  salePrice: 180000,  discount: 28, img: imgPowerBank    },
]

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

export default function Offers() {
  const navigate       = useNavigate()
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const handleAddToCart = (item: OfferProduct) => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    item.id,
      name:  item.name,
      price: item.salePrice,
      img:   item.img,
    })
    setAdded(item.name)
    setTimeout(() => setAdded(null), 2000)
  }

  return (
    <div className="offers-page">
      <Navbar />

      {added && (
        <div className="offers-toast">
          ✓ {added} added to cart!
        </div>
      )}

      {/* Header */}
      <div className="offers-header">
        <h1>Exclusive Offers</h1>
        <p>Limited time deals — don't miss out</p>
      </div>

      {/* Grid */}
      <section className="offers-section">
        <div className="offers-grid">
          {offers.map(item => (
            <div key={item.id} className="offer-card">
              <div className="offer-badge">SAVE {item.discount}%</div>
              <div className="offer-card-img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="offer-card-body">
                <p className="offer-name">{item.name}</p>
                <div className="offer-prices">
                  <span className="offer-price-old">{formatPrice(item.originalPrice)}</span>
                  <span className="offer-price-new">{formatPrice(item.salePrice)}</span>
                </div>
                <button
                  className="offer-btn-cart"
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