// Mirrors server/src/config/zones.js — node registry for the map and route graph.
export const ZONES = [
  { id: 'BASE', name: 'Response Base', type: 'base', lat: 25.612, lng: 85.141 },
  { id: 'ZoneA', name: 'Zone A — Patliputra', type: 'zone', lat: 25.626, lng: 85.118 },
  { id: 'ZoneB', name: 'Zone B — Kankarbagh', type: 'zone', lat: 25.592, lng: 85.16 },
  { id: 'ZoneC', name: 'Zone C — Digha', type: 'zone', lat: 25.618, lng: 85.08 },
  { id: 'ZoneD', name: 'Zone D — Rajendra Nagar', type: 'zone', lat: 25.605, lng: 85.145 },
  { id: 'ZoneE', name: 'Zone E — Danapur', type: 'zone', lat: 25.635, lng: 85.045 },
]

export function getZoneCoords(id) {
  const z = ZONES.find((zone) => zone.id === id)
  return z ? [z.lat, z.lng] : [25.612, 85.141]
}

export function getZoneName(id) {
  return ZONES.find((zone) => zone.id === id)?.name || id
}
