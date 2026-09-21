import api from '../api/client.js'

export const getDistricts = () => api.get('/districts').then((r) => r.data)
export const getDistrict = (id) => api.get(`/districts/${id}`).then((r) => r.data)
