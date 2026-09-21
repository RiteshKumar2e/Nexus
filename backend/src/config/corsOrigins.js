// CLIENT_URL accepts one origin or a comma-separated list (e.g. local dev +
// a deployed frontend at once). Used by both the Express CORS middleware and
// the Socket.IO server so they always agree on what's allowed.
const DEFAULT_ORIGIN = 'http://localhost:5173'

export function getAllowedOrigins() {
  const raw = process.env.CLIENT_URL
  if (!raw) return [DEFAULT_ORIGIN]

  const origins = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  return origins.length ? origins : [DEFAULT_ORIGIN]
}
