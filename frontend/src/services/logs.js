import api from './api'

const LogsAPI = {
  tail: async (n = 200) => {
    const { data } = await api.get('/admin/logs', { params: { n } })
    return data
  }
}

export default LogsAPI