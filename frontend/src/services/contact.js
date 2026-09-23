import api from '../api/client.js'

export const submitContact = (payload) => api.post('/contact', payload).then((r) => r.data)
