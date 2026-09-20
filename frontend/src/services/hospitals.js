import api from '../api/client.js'

export const getHospitals = (params) => api.get('/hospitals', { params }).then((r) => r.data)
export const updateHospital = (id, payload) => api.patch(`/hospitals/${id}`, payload).then((r) => r.data)
