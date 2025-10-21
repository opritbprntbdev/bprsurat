import api from './api'

// Hanya buat kalau belum ada file services/auth.js
const AuthAPI = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    // backend harus mereturn { token, user }
    return data
  },
  logout: async () => {
    const { data } = await api.post('/auth/logout')
    return data
  }
}

export default AuthAPI