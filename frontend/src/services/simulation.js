import api from '../api/client.js'

export const getSimulationState = () => api.get('/simulation/state').then((r) => r.data)
export const startSimulation = () => api.post('/simulation/start').then((r) => r.data)
export const pauseSimulation = () => api.post('/simulation/pause').then((r) => r.data)
export const resumeSimulation = () => api.post('/simulation/resume').then((r) => r.data)
export const resetSimulation = () => api.post('/simulation/reset').then((r) => r.data)
export const triggerEvent = (type, payload = {}) =>
  api.post('/simulation/event', { type, payload }).then((r) => r.data)
