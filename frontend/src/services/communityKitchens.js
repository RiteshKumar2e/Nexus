import api from '../api/client.js'

export const getCommunityKitchens = (params) => api.get('/community-kitchens', { params }).then((r) => r.data)
export const updateCommunityKitchen = (id, payload) => api.patch(`/community-kitchens/${id}`, payload).then((r) => r.data)
