import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            'AIzaSyAfz2JpQKR75U2eNgybb3A2SwAf2fzBFoo',
  authDomain:        'oryon-ecommerce.firebaseapp.com',
  projectId:         'oryon-ecommerce',
  storageBucket:     'oryon-ecommerce.firebasestorage.app',
  messagingSenderId: '529118300430',
  appId:             '1:529118300430:web:d761c2d3a928d2c919ef5f',
  measurementId:     'G-XLW38SJB9K',
}

const app = initializeApp(firebaseConfig)

export const auth    = getAuth(app)
export const db      = getFirestore(app)
export const storage = getStorage(app)