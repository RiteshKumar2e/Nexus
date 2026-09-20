import api from '../api/client.js'

export const getResources = (params) => api.get('/resources', { params }).then((r) => r.data)
export const updateResource = (id, payload) => api.patch(`/resources/${id}`, payload).then((r) => r.data)
