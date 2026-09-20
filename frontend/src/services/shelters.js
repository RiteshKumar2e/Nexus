import api from '../api/client.js'

export const getShelters = (params) => api.get('/shelters', { params }).then((r) => r.data)
export const updateShelter = (id, payload) => api.patch(`/shelters/${id}`, payload).then((r) => r.data)
