import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import './CategoryPage.css'

// ── Assets ─────────────────────────────────────────────
import imgAirpodsMax    from '../assets/AirpodsMax.png'
import imgSamsungPods   from '../assets/Samsungpods.png'
import imgAirpodsPro3   from '../assets/AirPodsPro3.png'
import imgSonyBlack     from '../assets/SonyBlack.png'
import imgAirpodsGreen  from '../assets/airpodsmaxgreen.png'
import imgAirpodsBlack  from '../assets/airpodsmaxblack.webp'
import imgIphone17      from '../assets/Iphone17ProMax.png'
import imgIphonePink    from '../assets/Iphonepink.png'
import imgIphoneHero    from '../assets/Iphone Hero.png'
import imgPowerBank     from '../assets/Powerbank.png'
import imgJBL           from '../assets/JBL.png'
import imgJBLClip       from '../assets/JBLClip.png'
import imgHomePod       from '../assets/Homepod.png'
import imgIpadMini      from '../assets/IpadMini.png'
import imgIpad          from '../assets/ipad.png'

// ── Tipos ──────────────────────────────────────────────
interface Product {
  id: number
  name: string
  price: string
  img: string
}

// ── Datos por categoría ────────────────────────────────
const categoryData: Record<string, { title: string; description: string; products: Product[] }> = {
  headphones: {
    title: 'Headphones',
    description: 'Wireless, noise-cancelling and studio headphones',
    products: [
      { id: 1,  name: 'AirPods Max',           price: '$2.700.000 COP', img: imgAirpodsMax   },
      { id: 2,  name: 'Headphones Samsung',     price: '$2.077.000 COP', img: imgSamsungPods  },
      { id: 3,  name: 'AirPods Pro 3',          price: '$1.100.000 COP', img: imgAirpodsPro3  },
      { id: 4,  name: 'Headphones Sony',        price: '$1.300.000 COP', img: imgSonyBlack    },
      { id: 5,  name: 'AirPods Max Green',      price: '$2.700.000 COP', img: imgAirpodsGreen },
      { id: 6,  name: 'AirPods Max Black',      price: '$2.700.000 COP', img: imgAirpodsBlack },
    ],
  },
  smartphones: {
    title: 'Smartphones',
    description: 'Latest flagship and mid-range phones',
    products: [
      { id: 7,  name: 'iPhone 17 Pro Max',      price: '$5.400.000 COP', img: imgIphone17    },
      { id: 8,  name: 'iPhone 15 Pink',         price: '$4.200.000 COP', img: imgIphonePink  },
      { id: 9,  name: 'iPhone 15 Pro',          price: '$5.200.000 COP', img: imgIphoneHero  },
    ],
  },
  accessories: {
    title: 'Accessories',
    description: 'Chargers, power banks, speakers and more',
    products: [
      { id: 10, name: 'Power Bank Pro',         price: '$180.000 COP',   img: imgPowerBank   },
      { id: 11, name: 'JBL Speaker',            price: '$2.150.000 COP', img: imgJBL         },
      { id: 12, name: 'JBL Clip',               price: '$350.000 COP',   img: imgJBLClip     },
    ],
  },
  smartwatches: {
    title: 'Smartwatches',
    description: 'Smart speakers, wearables and home devices',
    products: [
      { id: 13, name: 'HomePod',                price: '$899.000 COP',   img: imgHomePod     },
    ],
  },
  tablets: {
    title: 'Tablets',
    description: 'iPads and Android tablets for work and play',
    products: [
      { id: 14, name: 'Apple iPad Mini 256gb',  price: '$2.200.000 COP', img: imgIpadMini    },
      { id: 15, name: 'Apple iPad',             price: '$3.100.000 COP', img: imgIpad        },
    ],
  },
}

// ── Componente principal ───────────────────────────────
export default function CategoryPage() {
  const { category }   = useParams<{ category: string }>()
  const navigate       = useNavigate()
  const { isLoggedIn } = useAuth()
  const { addItem }    = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const data = category ? categoryData[category] : null

  if (!data) {
    return (
      <div className="catpage-notfound">
        <Navbar />
        <p>Category not found.</p>
        <button onClick={() => navigate('/categories')}>← Back to Categories</button>
        <SharedFooter />
      </div>
    )
  }

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
    <div className="catpage">
      <Navbar />

      {/* Toast */}
      {added && (
        <div className="catpage-toast">
          ✓ {added} added to cart!
        </div>
      )}

      {/* Header */}
      <div className="catpage-header">
        <span className="catpage-back" onClick={() => navigate('/categories')}>
          ← Back to Categories
        </span>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
      </div>

      {/* Grid de productos */}
      <section className="catpage-section">
        <div className="catpage-grid">
          {data.products.map(item => (
            <div key={item.id} className="catpage-card">
              <div className="catpage-card-img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="catpage-card-body">
                <p className="catpage-card-name">{item.name}</p>
                <p className="catpage-card-price">{item.price}</p>
                <button
                  className="catpage-btn-cart"
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