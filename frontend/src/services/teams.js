import api from '../api/client.js'

export const getTeams = (params) => api.get('/teams', { params }).then((r) => r.data)
export const getTeam = (id) => api.get(`/teams/${id}`).then((r) => r.data)
export const updateTeam = (id, payload) => api.patch(`/teams/${id}`, payload).then((r) => r.data)
