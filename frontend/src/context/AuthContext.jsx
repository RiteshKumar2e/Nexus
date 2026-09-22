import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('nexus_user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('nexus_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.user)
        localStorage.setItem('nexus_user', JSON.stringify(data.user))
      })
      .catch(() => {
        localStorage.removeItem('nexus_token')
        localStorage.removeItem('nexus_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('nexus_token', data.token)
    localStorage.setItem('nexus_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('nexus_token', data.token)
    localStorage.setItem('nexus_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('nexus_token')
    localStorage.removeItem('nexus_user')
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (name) => {
    const { data } = await api.put('/auth/profile', { name })
    localStorage.setItem('nexus_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    await api.put('/auth/password', { currentPassword, newPassword })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
