import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthAPI from '../services/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // load dari localStorage saat mount
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
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    navigate('/letters')
  }

  const logout = async () => {
    try {
      await AuthAPI.logout()
    } catch (e) {
      // ignore server logout errors
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