import './CategoryGrid.css'
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
    <section className="category-grid-section">
      <div className="category-grid">
        {categories.map((cat) => (
          <Link key={cat.name} to={cat.path} className="category-grid-link">
            <div className="category-grid-card">
              <img src={cat.image} alt={cat.name} className="category-grid-img" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryGrid