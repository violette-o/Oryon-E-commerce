import { useState, useEffect } from 'react'
import { getProducts, getProductsByCategory, getProductsBySeller } from '../services/products'
import type { Product } from '../services/products'

// ── Todos los productos ───────────────────────────────
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}

// ── Productos por categoría ───────────────────────────
export function useProductsByCategory(category: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    if (!category) return
    setLoading(true)
    getProductsByCategory(category)
      .then(setProducts)
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false))
  }, [category])

  return { products, loading, error }
}

// ── Productos de un vendedor ──────────────────────────
export function useSellerProducts(sellerId: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    if (!sellerId) return
    getProductsBySeller(sellerId)
      .then(setProducts)
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false))
  }, [sellerId])

  const refresh = () => {
    setLoading(true)
    getProductsBySeller(sellerId)
      .then(setProducts)
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false))
  }

  return { products, loading, error, refresh }
}