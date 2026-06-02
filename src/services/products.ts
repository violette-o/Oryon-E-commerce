import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from '../firebase'

// ── Tipo de producto ───────────────────────────────────
export interface Product {
  id?:          string
  name:         string
  description:  string
  price:        number
  category:     string
  condition:    'new' | 'used'
  images:       string[]
  sellerId:     string
  sellerName:   string
  createdAt?:   unknown
  views?:       number
  active?:      boolean
}

const COL = 'products'

// ── Crear producto ─────────────────────────────────────
export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'views'>) {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    views:     0,
    active:    true,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

// ── Obtener todos los productos activos ────────────────
export async function getProducts(): Promise<Product[]> {
  const q = query(
    collection(db, COL),
    where('active', '==', true),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

// ── Obtener productos por categoría ───────────────────
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(
    collection(db, COL),
    where('category', '==', category),
    where('active', '==', true),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

// ── Obtener productos de un vendedor ──────────────────
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const q = query(
    collection(db, COL),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

// ── Obtener un producto por ID ────────────────────────
export async function getProductById(id: string): Promise<Product | null> {
  const ref  = doc(db, COL, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  await updateDoc(ref, { views: increment(1) })
  return { id: snap.id, ...snap.data() } as Product
}

// ── Actualizar producto ───────────────────────────────
export async function updateProduct(id: string, data: Partial<Product>) {
  await updateDoc(doc(db, COL, id), data)
}

// ── Pausar / reactivar producto ───────────────────────
export async function toggleProduct(id: string, active: boolean) {
  await updateDoc(doc(db, COL, id), { active })
}

// ── Eliminar producto ─────────────────────────────────
export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, COL, id))
}