import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// ── Tipo de rating ─────────────────────────────────────
export interface Rating {
  id?:       string
  productId: string
  userId:    string
  userName:  string
  stars:     number
  review:    string
  createdAt?: unknown
}

const COL = 'ratings'

// ── Agregar o actualizar rating ────────────────────────
export async function submitRating(data: Omit<Rating, 'id' | 'createdAt'>) {
  // Si ya existe un rating del mismo usuario para el mismo producto, lo actualiza
  const q    = query(collection(db, COL), where('productId', '==', data.productId), where('userId', '==', data.userId))
  const snap = await getDocs(q)

  if (!snap.empty) {
    await updateDoc(doc(db, COL, snap.docs[0].id), {
      stars:  data.stars,
      review: data.review,
    })
  } else {
    await addDoc(collection(db, COL), {
      ...data,
      createdAt: serverTimestamp(),
    })
  }
}

// ── Obtener ratings de un producto ────────────────────
export async function getRatings(productId: string): Promise<Rating[]> {
  const q    = query(collection(db, COL), where('productId', '==', productId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Rating))
}

// ── Calcular promedio ─────────────────────────────────
export function getAverage(ratings: Rating[]): number {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, r) => acc + r.stars, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}