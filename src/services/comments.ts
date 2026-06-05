import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// ── Tipo de comentario ─────────────────────────────────
export interface Comment {
  id?:        string
  productId:  string
  userId:     string
  userName:   string
  text:       string
  createdAt?: unknown
}

const COL = 'comments'

// ── Agregar comentario ─────────────────────────────────
export async function addComment(data: Omit<Comment, 'id' | 'createdAt'>) {
  await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

// ── Escuchar comentarios en tiempo real ────────────────
export function subscribeToComments(
  productId: string,
  callback: (comments: Comment[]) => void
) {
  const q = query(
    collection(db, COL),
    where('productId', '==', productId),
    orderBy('createdAt', 'asc')
  )

  return onSnapshot(q, snap => {
    const comments = snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment))
    callback(comments)
  })
}