import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getProductById, updateProduct } from '../services/products'
import { uploadProductImage } from '../services/storage'
import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import './EditProduct.css'

const CATEGORIES = ['Headphones', 'Smartphones', 'Accessories', 'Smartwatches', 'Tablets']

export default function EditProduct() {
  const { id }               = useParams<{ id: string }>()
  const { user, isLoggedIn } = useAuth()
  const navigate             = useNavigate()

  const [name,         setName]         = useState('')
  const [description,  setDescription]  = useState('')
  const [price,        setPrice]        = useState('')
  const [category,     setCategory]     = useState('')
  const [condition,    setCondition]    = useState<'new' | 'used'>('new')
  const [currentImage, setCurrentImage] = useState<string>('')
  const [imageFile,    setImageFile]    = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState('')
  const [success,      setSuccess]      = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isLoggedIn) { navigate('/login'); return null }

  useEffect(() => {
    if (!id) return
    getProductById(id).then(product => {
      if (!product) { navigate('/dashboard'); return }
      if (product.sellerId !== user!.uid) { navigate('/dashboard'); return }
      setName(product.name)
      setDescription(product.description)
      setPrice(String(product.price))
      setCategory(product.category)
      setCondition(product.condition)
      setCurrentImage(product.images?.[0] ?? '')
    }).finally(() => setLoading(false))
  }, [id])

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
    setCurrentImage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !description || !price || !category) { setError('Please fill in all required fields.'); return }
    if (isNaN(Number(price)) || Number(price) <= 0)   { setError('Please enter a valid price.'); return }

    setSaving(true)
    try {
      let imageUrl = currentImage
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, user!.uid)
      }
      await updateProduct(id!, {
        name, description, price: Number(price), category, condition,
        images: imageUrl ? [imageUrl] : [],
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch {
      setError('Failed to update product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="editproduct-page">
        <Navbar />
        <p className="editproduct-loading">Loading product...</p>
        <SharedFooter />
      </div>
    )
  }

  const previewSrc = imagePreview || currentImage

  return (
    <div className="editproduct-page">
      <Navbar />
      {success && <div className="editproduct-toast">✓ Product updated successfully!</div>}

      <div className="editproduct-header">
        <h1>Edit Product</h1>
        <p>Update your product information</p>
      </div>

      <section className="editproduct-section">
        <form className="editproduct-form" onSubmit={handleSubmit}>

          <div className="editproduct-field">
            <label>Product Name <span>*</span></label>
            <input type="text" placeholder="e.g. Samsung Headphones WH-1000" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="editproduct-field">
            <label>Description <span>*</span></label>
            <textarea placeholder="Describe your product in detail..." value={description} onChange={e => setDescription(e.target.value)} rows={5} />
          </div>

          <div className="editproduct-field">
            <label>Price (COP) <span>*</span></label>
            <input type="number" placeholder="e.g. 2000000" value={price} onChange={e => setPrice(e.target.value)} min="0" />
          </div>

          <div className="editproduct-row">
            <div className="editproduct-field">
              <label>Category <span>*</span></label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="editproduct-field">
              <label>Condition <span>*</span></label>
              <div className="editproduct-condition">
                <button type="button" className={`condition-btn ${condition === 'new' ? 'condition-btn--active' : ''}`} onClick={() => setCondition('new')}>New</button>
                <button type="button" className={`condition-btn ${condition === 'used' ? 'condition-btn--active' : ''}`} onClick={() => setCondition('used')}>Used</button>
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div className="editproduct-field">
            <label>Product Image <span className="optional">(optional)</span></label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            {!previewSrc ? (
              <div className="editproduct-upload-area" onClick={() => fileInputRef.current?.click()}>
                <Upload size={28} className="editproduct-upload-icon" />
                <p>Click to upload an image</p>
                <span>PNG, JPG, WEBP up to 5MB</span>
              </div>
            ) : (
              <div className="editproduct-preview-wrap">
                <img src={previewSrc} alt="Preview" className="editproduct-preview-img" />
                <button type="button" className="editproduct-remove-img" onClick={handleRemoveImage}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {error && <p className="editproduct-error">{error}</p>}

          <div className="editproduct-actions">
            <button type="button" className="editproduct-cancel" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="editproduct-submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>

      <SharedFooter />
    </div>
  )
}