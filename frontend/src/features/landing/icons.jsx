// Minimal, hand-authored line icons for the marketing landing page only —
// deliberately not a third-party icon library. Same visual language
// throughout: 24x24 viewBox, currentColor stroke, rounded caps/joins.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

export function ArrowIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  )
}

export function CheckCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="8 12.5 10.8 15 16 9.5" />
    </svg>
  )
}

export function AlertIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 L21 19.5 L3 19.5 Z" />
      <line x1="12" y1="9.5" x2="12" y2="14" />
      <circle cx="12" cy="16.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PlayIcon(props) {
  return (
    <svg {...base} {...props}>
      <polygon points="8 5.5 19 12 8 18.5" />
    </svg>
  )
}

export function WaveIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9c2 -2.5 4 -2.5 6 0s4 2.5 6 0 4 -2.5 6 0" />
      <path d="M3 15c2 -2.5 4 -2.5 6 0s4 2.5 6 0 4 -2.5 6 0" />
    </svg>
  )
}

export function MedicalIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <line x1="12" y1="8.5" x2="12" y2="15.5" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
    </svg>
  )
}

export function HomeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5 L12 4.5 L20 11.5" />
      <path d="M6 10.5 V19.5 H18 V10.5" />
    </svg>
  )
}
