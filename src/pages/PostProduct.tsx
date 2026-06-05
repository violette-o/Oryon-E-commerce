import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { createProduct } from '../services/products'
import { uploadProductImage } from '../services/storage'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import './PostProduct.css'

const CATEGORIES = ['Headphones', 'Smartphones', 'Accessories', 'Smartwatches', 'Tablets']

export default function PostProduct() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [name,         setName]         = useState('')
  const [description,  setDescription]  = useState('')
  const [price,        setPrice]        = useState('')
  const [category,     setCategory]     = useState('')
  const [condition,    setCondition]    = useState<'new' | 'used'>('new')
  const [imageFile,    setImageFile]    = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [success,      setSuccess]      = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isLoggedIn) { navigate('/login'); return null }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please select a valid image file.'); return }
    if (file.size > 5 * 1024 * 1024)    { setError('Image must be less than 5MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError('')
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !description || !price || !category) { setError('Please fill in all required fields.'); return }
    if (isNaN(Number(price)) || Number(price) <= 0)   { setError('Please enter a valid price.'); return }

    setLoading(true)
    try {
      let imageUrl = ''
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, user!.uid)
      }
      await createProduct({
        name, description, price: Number(price), category, condition,
        images:     imageUrl ? [imageUrl] : [],
        sellerId:   user!.uid,
        sellerName: user!.displayName ?? 'Anonymous',
        active:     true,
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch {
      setError('Failed to post product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="postproduct-page">
      <Navbar />
      {success && <div className="postproduct-toast">✓ Product posted successfully!</div>}

      <div className="postproduct-header">
        <h1>Post a Product</h1>
        <p>Fill in the details to list your product for sale</p>
      </div>

      <section className="postproduct-section">
        <form className="postproduct-form" onSubmit={handleSubmit}>

          <div className="postproduct-field">
            <label>Product Name <span>*</span></label>
            <input type="text" placeholder="e.g. Samsung Headphones WH-1000" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="postproduct-field">
            <label>Description <span>*</span></label>
            <textarea placeholder="Describe your product in detail..." value={description} onChange={e => setDescription(e.target.value)} rows={5} />
          </div>

          <div className="postproduct-field">
            <label>Price (COP) <span>*</span></label>
            <input type="number" placeholder="e.g. 2000000" value={price} onChange={e => setPrice(e.target.value)} min="0" />
          </div>

          <div className="postproduct-row">
            <div className="postproduct-field">
              <label>Category <span>*</span></label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="postproduct-field">
              <label>Condition <span>*</span></label>
              <div className="postproduct-condition">
                <button type="button" className={`condition-btn ${condition === 'new' ? 'condition-btn--active' : ''}`} onClick={() => setCondition('new')}>New</button>
                <button type="button" className={`condition-btn ${condition === 'used' ? 'condition-btn--active' : ''}`} onClick={() => setCondition('used')}>Used</button>
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div className="postproduct-field">
            <label>Product Image <span className="optional">(optional)</span></label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            {!imagePreview ? (
              <div className="postproduct-upload-area" onClick={() => fileInputRef.current?.click()}>
                <Upload size={28} className="postproduct-upload-icon" />
                <p>Click to upload an image</p>
                <span>PNG, JPG, WEBP up to 5MB</span>
              </div>
            ) : (
              <div className="postproduct-preview-wrap">
                <img src={imagePreview} alt="Preview" className="postproduct-preview-img" />
                <button type="button" className="postproduct-remove-img" onClick={handleRemoveImage}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {error && <p className="postproduct-error">{error}</p>}

          <div className="postproduct-actions">
            <button type="button" className="postproduct-cancel" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="postproduct-submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Product'}
            </button>
          </div>
        </form>
      </section>

      <SharedFooter />
    </div>
  )
}