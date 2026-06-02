import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import './MyOrders.css'

import imgSamsungPods  from '../assets/Samsungpods.png'
import imgIpadMini     from '../assets/IpadMini.png'
import imgAirpodsPro3  from '../assets/AirPodsPro3.png'
import imgIphone17     from '../assets/Iphone17ProMax.png'
import imgJBLClip      from '../assets/JBLClip.png'

interface OrderItem {
  name: string
  price: string
  img: string
  qty: number
}

interface Order {
  id: string
  date: string
  status: 'Delivered' | 'Processing' | 'Shipped'
  total: string
  items: OrderItem[]
}

const orders: Order[] = [
  {
    id: '#ORY-10041',
    date: 'April 2, 2026',
    status: 'Delivered',
    total: '$3.177.000 COP',
    items: [
      { name: 'Headphones Samsung',    price: '$2.077.000 COP', img: imgSamsungPods, qty: 1 },
      { name: 'JBL Clip',             price: '$350.000 COP',   img: imgJBLClip,     qty: 2 },
    ],
  },
  {
    id: '#ORY-10038',
    date: 'March 18, 2026',
    status: 'Delivered',
    total: '$2.200.000 COP',
    items: [
      { name: 'Apple iPad Mini 256gb', price: '$2.200.000 COP', img: imgIpadMini, qty: 1 },
    ],
  },
  {
    id: '#ORY-10051',
    date: 'April 9, 2026',
    status: 'Processing',
    total: '$6.500.000 COP',
    items: [
      { name: 'iPhone 17 Pro Max',     price: '$5.400.000 COP', img: imgIphone17,    qty: 1 },
      { name: 'AirPods Pro 3',         price: '$1.100.000 COP', img: imgAirpodsPro3, qty: 1 },
    ],
  },
  {
    id: '#ORY-10047',
    date: 'April 5, 2026',
    status: 'Shipped',
    total: '$1.100.000 COP',
    items: [
      { name: 'AirPods Pro 3',         price: '$1.100.000 COP', img: imgAirpodsPro3, qty: 1 },
    ],
  },
]

function statusClass(status: Order['status']) {
  if (status === 'Delivered')  return 'order-status delivered'
  if (status === 'Shipped')    return 'order-status shipped'
  return 'order-status processing'
}

export default function MyOrders() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) => {
    setExpanded(prev => prev === id ? null : id)
  }

  return (
    <div className="myorders-page">
      <Navbar />

      {/* Header */}
      <div className="myorders-header">
        <h1>My Orders</h1>
        <p>Track and review your purchase history</p>
      </div>

      {/* Orders list */}
      <section className="myorders-section">
        {orders.map(order => (
          <div key={order.id} className="order-card">

            {/* Order summary row */}
            <div className="order-row" onClick={() => toggle(order.id)}>
              <div className="order-info">
                <span className="order-id">{order.id}</span>
                <span className="order-date">{order.date}</span>
              </div>
              <div className="order-meta">
                <span className={statusClass(order.status)}>{order.status}</span>
                <span className="order-total">{order.total}</span>
                <button className="order-toggle-btn" aria-label="Toggle order details">
                  {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>

            {/* Order items - expanded */}
            {expanded === order.id && (
              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <div className="order-item-img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="order-item-info">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-price">{item.price}</p>
                      <p className="order-item-qty">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
                <button
                  className="order-reorder-btn"
                  onClick={() => navigate('/')}
                >
                  Shop again
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      <SharedFooter />
    </div>
  )
}