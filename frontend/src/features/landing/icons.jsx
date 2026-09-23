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

export function PinIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21c4.5-4.6 7-8.3 7-11.2A7 7 0 0 0 5 9.8C5 12.7 7.5 16.4 12 21Z" />
      <circle cx="12" cy="9.7" r="2.2" />
    </svg>
  )
}

export function UsersIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M16 8.5a2.6 2.6 0 1 1 0-5.2" />
      <path d="M15 14c2.5 0.3 4.5 2.1 4.5 5" />
    </svg>
  )
}

export function GridIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  )
}

export function SparkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 L13.4 9 L19 10.4 L13.4 11.8 L12 17.3 L10.6 11.8 L5 10.4 L10.6 9 Z" />
    </svg>
  )
}
