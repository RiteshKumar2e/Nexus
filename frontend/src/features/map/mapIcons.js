import L from 'leaflet'

const COLORS = {
  critical: '#DC3D3D',
  high: '#E4A11A',
  team: '#2563D6',
  hospital: '#7B5CC7',
  shelter: '#2FA96B',
  base: '#1A2027',
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
  OPEN: '#9CA6B0',
  CONGESTED: '#E4A11A',
  BLOCKED: '#5B6673',
  DANGEROUS: '#DC3D3D',
}
