import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Persistir sesión en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('oryon_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Simulación — reemplazar con API real
    const saved = localStorage.getItem(`oryon_account_${email}`)
    if (!saved) return false
    const account = JSON.parse(saved)
    const loggedUser = { name: account.name, email: account.email }
    setUser(loggedUser)
    localStorage.setItem('oryon_user', JSON.stringify(loggedUser))
    return true
  }

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    // Guardar cuenta simulada
    const account = { name, email }
    localStorage.setItem(`oryon_account_${email}`, JSON.stringify(account))
    const newUser = { name, email }
    setUser(newUser)
    localStorage.setItem('oryon_user', JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('oryon_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}