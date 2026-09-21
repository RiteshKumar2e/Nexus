import api from '../api/client.js'

export const getAlerts = () => api.get('/alerts').then((r) => r.data)
