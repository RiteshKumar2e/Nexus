import api from '../api/client.js'

export const getMedicalUnits = (params) => api.get('/medical', { params }).then((r) => r.data)
export const updateMedicalUnit = (id, payload) => api.patch(`/medical/${id}`, payload).then((r) => r.data)
