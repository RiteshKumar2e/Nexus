import api from '../api/client.js'

export const getReliefCamps = (params) => api.get('/relief-camps', { params }).then((r) => r.data)
export const updateReliefCamp = (id, payload) => api.patch(`/relief-camps/${id}`, payload).then((r) => r.data)
