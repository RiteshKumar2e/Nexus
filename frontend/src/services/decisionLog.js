import api from '../api/client.js'

export const getDecisionLog = (params) => api.get('/decision-log', { params }).then((r) => r.data)
