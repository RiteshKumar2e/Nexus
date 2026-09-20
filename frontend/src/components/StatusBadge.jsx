const MAP = {
  critical: 'badge-critical',
  high: 'badge-critical',
  warning: 'badge-warning',
  medium: 'badge-warning',
  moderate: 'badge-warning',
  success: 'badge-success',
  available: 'badge-success',
  open: 'badge-success',
  active: 'badge-success',
  resolved: 'badge-success',
  low: 'badge-success',
  neutral: 'badge-neutral',
  busy: 'badge-neutral',
  en_route: 'badge-brand',
  brand: 'badge-brand',
  blocked: 'badge-critical',
  full: 'badge-critical',
  unavailable: 'badge-neutral',
  congested: 'badge-warning',
  dangerous: 'badge-critical',
  invalidated: 'badge-neutral',
  pending: 'badge-warning',
  executed: 'badge-success',
  rejected: 'badge-critical',
}

export default function StatusBadge({ status, label }) {
  const key = String(status || '').toLowerCase().replace(/\s+/g, '_')
  const cls = MAP[key] || 'badge-neutral'
  return <span className={cls}>{label || status}</span>
}
