import { useMemo } from 'react'
import api from '../services/api.js'

export function useAuth() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    location.href = '/login'
  }

  return { token, user, login, logout }
}