import L from 'leaflet'

const COLORS = {
  critical: '#A83A3A',
  high: '#C97A2E',
  team: '#C89B3C',
  medical: '#4F7EA8',
  camp: '#4B7A52',
  kitchen: '#7A5C1C',
  base: '#20231F',
  district_critical: '#A83A3A',
  district_high: '#C97A2E',
  district_monitoring: '#C9A227',
}

export function makeDivIcon(kind, { pulse = false, color } = {}) {
  const resolvedColor = color || COLORS[kind] || COLORS.team
  const size = kind === 'base' ? 14 : kind?.startsWith('district') ? 20 : 16
  return L.divIcon({
    className: 'nexus-marker',
    html: `<span style="
      display:block;
      width:${size}px;height:${size}px;
      background:${resolvedColor};
      border:2.5px solid white;
      border-radius:999px;
      box-shadow:0 1px 4px rgba(15,20,25,0.35);
      ${pulse ? 'animation:pulseDot 1.6s ease-in-out infinite;' : ''}
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export const ROAD_COLORS = {
  OPEN: '#A3A59A',
  CONGESTED: '#C97A2E',
  BLOCKED: '#5F625B',
  DANGEROUS: '#A83A3A',
}

export const RISK_COLORS = {
  CRITICAL: '#A83A3A',
  HIGH: '#C97A2E',
  MONITORING: '#C9A227',
}
