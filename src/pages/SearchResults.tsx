import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getProducts } from '../services/products'
import type { Product } from '../services/products'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import './SearchResults.css'

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

export default function SearchResults() {
  const [searchParams]     = useSearchParams()
  const navigate            = useNavigate()
  const { isLoggedIn }     = useAuth()
  const { addItem }        = useCart()

  const query = searchParams.get('q') ?? ''

  const [results,  setResults]  = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [added,    setAdded]    = useState<string | null>(null)

  useEffect(() => {
    if (!query) { setLoading(false); return }
    setLoading(true)
    getProducts().then(all => {
      const filtered = all.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    }).finally(() => setLoading(false))
  }, [query])

  const handleAddToCart = (item: Product) => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem({
      id:    item.name.length + item.price,
      name:  item.name,
      price: item.price,
      img:   item.images?.[0] ?? '',
    })
    setAdded(item.name)
    setTimeout(() => setAdded(null), 2000)
  }

  return (
    <div className="search-page">
      <Navbar />

      {added && (
        <div className="search-toast">✓ {added} added to cart!</div>
      )}

      <div className="search-header">
        <h1>
          {query
            ? <>Results for <span>"{query}"</span></>
            : 'Search Products'
          }
        </h1>
        {!loading && query && (
          <p>{results.length} {results.length === 1 ? 'result' : 'results'} found</p>
        )}
      </div>

      <section className="search-section">
        {loading && <p className="search-msg">Searching...</p>}

        {!loading && !query && (
          <p className="search-msg">Enter a keyword in the search bar to find products.</p>
        )}

        {!loading && query && results.length === 0 && (
          <div className="search-empty">
            <p>No products found for "{query}".</p>
            <button onClick={() => navigate('/')}>← Back to Home</button>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="search-grid">
            {results.map(item => (
              <div key={item.id} className="search-card">
                <div className="search-card-img">
                  {item.images?.[0]
                    ? <img src={item.images[0]} alt={item.name} />
                    : <span className="search-card-noimg">No image</span>
                  }
                </div>
                <div className="search-card-body">
                  <p className="search-card-name">{item.name}</p>
                  <p className="search-card-cat">{item.category} · {item.condition}</p>
                  <p className="search-card-price">{formatPrice(item.price)}</p>
                  <button
                    className="search-card-btn"
                    onClick={() => handleAddToCart(item)}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <SharedFooter />
    </div>
  )
}