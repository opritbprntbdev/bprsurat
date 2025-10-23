import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Accept': 'application/json' }
})

// add debug log to request interceptor to see Authorization header at request time
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`

  // debug logging removed for normal operation
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!location.pathname.startsWith('/login')) location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api