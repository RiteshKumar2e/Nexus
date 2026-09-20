import api from '../api/client.js'

export const getIncidents = (params) => api.get('/incidents', { params }).then((r) => r.data)
export const getIncident = (id) => api.get(`/incidents/${id}`).then((r) => r.data)
export const createIncident = (payload) => api.post('/incidents', payload).then((r) => r.data)
export const updateIncident = (id, payload) => api.patch(`/incidents/${id}`, payload).then((r) => r.data)
