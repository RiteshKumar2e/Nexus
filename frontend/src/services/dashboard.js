import api from '../api/client.js'

export const getDashboardSummary = () => api.get('/dashboard/summary').then((r) => r.data)
