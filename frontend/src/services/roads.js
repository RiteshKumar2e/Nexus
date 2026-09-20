import api from '../api/client.js'

export const getRoads = (params) => api.get('/roads', { params }).then((r) => r.data)
export const updateRoad = (id, payload) => api.patch(`/roads/${id}`, payload).then((r) => r.data)
