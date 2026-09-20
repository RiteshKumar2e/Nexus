import L from 'leaflet'

const COLORS = {
  critical: '#A83A3A',
  high: '#C97A2E',
  team: '#C89B3C',
  hospital: '#4F7EA8',
  shelter: '#4B7A52',
  base: '#20231F',
}

export function makeDivIcon(kind, { pulse = false } = {}) {
  const color = COLORS[kind] || COLORS.team
  const size = kind === 'base' ? 14 : 16
  return L.divIcon({
    className: 'nexus-marker',
    html: `<span style="
      display:block;
      width:${size}px;height:${size}px;
      background:${color};
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
