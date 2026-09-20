// Static node registry for the Patna Flood Response scenario graph.
// Roads connect these nodes; teams, hospitals, and shelters sit at specific nodes.
export const ZONES = [
  { id: 'BASE', name: 'Response Base', type: 'base', lat: 25.6120, lng: 85.1410 },
  { id: 'ZoneA', name: 'Zone A — Patliputra', type: 'zone', lat: 25.6260, lng: 85.1180 },
  { id: 'ZoneB', name: 'Zone B — Kankarbagh', type: 'zone', lat: 25.5920, lng: 85.1600 },
  { id: 'ZoneC', name: 'Zone C — Digha', type: 'zone', lat: 25.6180, lng: 85.0800 },
  { id: 'ZoneD', name: 'Zone D — Rajendra Nagar', type: 'zone', lat: 25.6050, lng: 85.1450 },
  { id: 'ZoneE', name: 'Zone E — Danapur', type: 'zone', lat: 25.6350, lng: 85.0450 },
]

export function getZone(id) {
  return ZONES.find((z) => z.id === id)
}
