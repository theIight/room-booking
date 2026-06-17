import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api, { setAuthToken } from '../../services/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'booking_auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem(STORAGE_KEY)
      setAuthToken(null)
      setAuth(null)
    }

    window.addEventListener('auth:expired', logout)
    return () => window.removeEventListener('auth:expired', logout)
  }, [])

  async function login(credentials) {
    const response = await api.post('/auth/token', credentials)
    const nextAuth = {
      token: response.data.token,
      username: credentials.username,
      expires_at: response.data.expires_at,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
    setAuthToken(nextAuth.token)
    setAuth(nextAuth)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setAuthToken(null)
    setAuth(null)
  }

  const value = useMemo(() => ({ auth, username: auth?.username, login, logout }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
