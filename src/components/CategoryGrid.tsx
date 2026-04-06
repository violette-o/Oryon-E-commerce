import headphones from '../assets/audifonos negros airpods max.png'
import airpods from '../assets/Airpods.png'
import ipad from '../assets/ipad.png'
import iphoneGrid from '../assets/Iphone Grid.png'

const categories = [
  { name: 'Headphones', image: headphones },
  { name: 'AirPods',    image: airpods },
  { name: 'iPad',       image: ipad },
  { name: 'iPhone',     image: iphoneGrid },
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
          <div
            key={cat.name}
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
        ))}
      </div>
    </section>
  )
}

export default CategoryGrid