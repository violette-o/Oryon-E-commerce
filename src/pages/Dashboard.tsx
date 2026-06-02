import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Trash2, PauseCircle, PlayCircle, Edit } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSellerProducts } from '../hooks/useProducts'
import { toggleProduct, deleteProduct } from '../services/products'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import './Dashboard.css'

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-CO') + ' COP'
}

export default function Dashboard() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  if (!isLoggedIn) { navigate('/login'); return null }

  const { products, loading, error, refresh } = useSellerProducts(user!.uid)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleToggle = async (id: string, active: boolean) => {
    await toggleProduct(id, !active)
    showToast(active ? 'Product paused.' : 'Product reactivated.')
    refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    await deleteProduct(id)
    showToast('Product deleted.')
    refresh()
  }

  const activeCount   = products.filter(p => p.active).length
  const pausedCount   = products.filter(p => !p.active).length
  const totalViews    = products.reduce((sum, p) => sum + (p.views ?? 0), 0)

  return (
    <div className="dashboard-page">
      <Navbar />

      {toast && <div className="dashboard-toast">{toast}</div>}

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p>Welcome back, {user?.displayName}</p>
        </div>
        <button className="dashboard-post-btn" onClick={() => navigate('/post-product')}>
          <Plus size={16} /> Post Product
        </button>
      </div>

      {/* Stats */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{products.length}</span>
          <span className="stat-label">Total Listings</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{activeCount}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{pausedCount}</span>
          <span className="stat-label">Paused</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalViews}</span>
          <span className="stat-label">Total Views</span>
        </div>
      </section>

      {/* Products list */}
      <section className="dashboard-section">
        <h2>My Listings</h2>

        {loading && <p className="dashboard-msg">Loading your products...</p>}
        {error   && <p className="dashboard-msg dashboard-msg--error">{error}</p>}

        {!loading && products.length === 0 && (
          <div className="dashboard-empty">
            <p>You haven't posted any products yet.</p>
            <button className="dashboard-post-btn" onClick={() => navigate('/post-product')}>
              <Plus size={16} /> Post your first product
            </button>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="dashboard-list">
            {products.map(product => (
              <div key={product.id} className={`dashboard-item ${!product.active ? 'dashboard-item--paused' : ''}`}>
                {/* Image */}
                <div className="dashboard-item-img">
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name} />
                    : <span className="dashboard-item-placeholder">No image</span>
                  }
                </div>

                {/* Info */}
                <div className="dashboard-item-info">
                  <p className="dashboard-item-name">{product.name}</p>
                  <p className="dashboard-item-price">{formatPrice(product.price)}</p>
                  <div className="dashboard-item-meta">
                    <span className="dashboard-item-cat">{product.category}</span>
                    <span className={`dashboard-item-status ${product.active ? 'status--active' : 'status--paused'}`}>
                      {product.active ? 'Active' : 'Paused'}
                    </span>
                    <span className="dashboard-item-views">
                      <Eye size={13} /> {product.views ?? 0} views
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="dashboard-item-actions">
                  <button
                    className="action-btn action-btn--edit"
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn action-btn--toggle"
                    onClick={() => handleToggle(product.id!, product.active!)}
                    title={product.active ? 'Pause' : 'Reactivate'}
                  >
                    {product.active ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => handleDelete(product.id!)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
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