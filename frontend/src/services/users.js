import api from './api'

export const UsersAPI = {
  list: async (params = {}) => {
    const { data } = await api.get('/admin/users', { params })
    return data
  },
  create: async (payload) => {
    const body = { role_id: 5, status: 'aktif', ...payload }
    const { data } = await api.post('/admin/users', body)
    return data
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/admin/users/${id}`, payload)
    return data
  },
  resetPassword: async (id) => {
    const { data } = await api.post(`/admin/users/${id}/reset-password`)
    return data
  },
  deactivate: async (id) => {
    const { data } = await api.post(`/admin/users/${id}/deactivate`)
    return data
  },
  delete: async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`) // <— baru
    return data
  }
}
export default UsersAPI