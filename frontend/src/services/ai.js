import api from '../api/client.js'

export const queryCopilot = (question) => api.post('/ai/query', { question }).then((r) => r.data)
export const analyzeEvidence = (formData) =>
  api.post('/ai/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
