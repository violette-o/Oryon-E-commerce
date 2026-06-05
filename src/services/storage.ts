import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase'

// ── Subir imagen ───────────────────────────────────────
export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  const snapshot   = await uploadBytes(storageRef, file)
  const url        = await getDownloadURL(snapshot.ref)
  return url
}

// ── Subir imagen de producto ───────────────────────────
export async function uploadProductImage(file: File, sellerId: string): Promise<string> {
  const ext      = file.name.split('.').pop()
  const filename = `${Date.now()}.${ext}`
  const path     = `products/${sellerId}/${filename}`
  return uploadImage(file, path)
}

// ── Eliminar imagen ────────────────────────────────────
export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch {
    // Si no existe, no hace nada
  }
}