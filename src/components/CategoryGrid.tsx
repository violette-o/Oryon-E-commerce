import { Link } from 'react-router-dom'
import headphones from '../assets/Audifonos negros airpods max.png'
import airpods    from '../assets/Airpods.png'
import ipad       from '../assets/ipad.png'
import iphoneGrid from '../assets/Iphone Grid.png'

const categories = [
  { name: 'Headphones', image: headphones, path: '/product' },
  { name: 'AirPods',    image: airpods,    path: '/product' },
  { name: 'iPad',       image: ipad,       path: '/product' },
  { name: 'iPhone',     image: iphoneGrid, path: '/product' },
]

const CategoryGrid = () => {
  return (
    <section style={{
      padding: '40px 80px',
      backgroundColor: '#fff',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px'
      }}>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.path}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                backgroundColor: '#f0f0f0',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: '75%',
                  height: '75%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryGrid