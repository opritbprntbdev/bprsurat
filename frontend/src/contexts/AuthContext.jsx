import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthAPI from '../services/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
  const data = await AuthAPI.login(email, password)
    if (!data?.token) throw new Error('Tidak dapat login')

    // Important: persist token first (localStorage) so interceptors/readers can access it immediately
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))

    // then update state
    setToken(data.token)
    setUser(data.user)

    // Do navigation from caller (LoginPage) to avoid double navigation race
    // If you prefer, you can keep this navigate here but ensure LoginPage doesn't navigate again.
  }

  const logout = async () => {
    try {
      await AuthAPI.logout()
    } catch (e) {
      // ignore
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!token && !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}