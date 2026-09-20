import api from '../api/client.js'

export const getPlans = (params) => api.get('/plans', { params }).then((r) => r.data)
export const getPlan = (id) => api.get(`/plans/${id}`).then((r) => r.data)
export const approvePlan = (id) => api.post(`/plans/${id}/approve`).then((r) => r.data)
export const rejectPlan = (id, reason) => api.post(`/plans/${id}/reject`, { reason }).then((r) => r.data)
