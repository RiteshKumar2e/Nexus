// Node registry for the Bihar Flood 2026 response simulation graph.
// Roads connect these nodes; teams, medical units, and relief camps sit at
// specific districts. Coordinates are approximate district-HQ locations,
// used for routing/map placement — not survey-grade GPS data.
export const ZONES = [
  { id: 'BASE', name: 'State EOC — Patna', type: 'base', lat: 25.6120, lng: 85.1410 },
  { id: 'PATNA', name: 'Patna (riverine areas)', type: 'district', lat: 25.6180, lng: 85.0800 },
  { id: 'BHAGALPUR', name: 'Bhagalpur', type: 'district', lat: 25.2445, lng: 86.9718 },
  { id: 'MUNGER', name: 'Munger', type: 'district', lat: 25.3746, lng: 86.4735 },
  { id: 'VAISHALI', name: 'Vaishali', type: 'district', lat: 25.6941, lng: 85.2088 },
  { id: 'BEGUSARAI', name: 'Begusarai', type: 'district', lat: 25.4182, lng: 86.1272 },
  { id: 'BHOJPUR', name: 'Bhojpur', type: 'district', lat: 25.5541, lng: 84.6631 },
  { id: 'KHAGARIA', name: 'Khagaria', type: 'district', lat: 25.5023, lng: 86.4675 },
  { id: 'SAMASTIPUR', name: 'Samastipur', type: 'district', lat: 25.8623, lng: 85.7801 },
  { id: 'DARBHANGA', name: 'Darbhanga', type: 'district', lat: 26.1542, lng: 85.8918 },
  { id: 'SAHARSA', name: 'Saharsa', type: 'district', lat: 25.8823, lng: 86.5906 },
  { id: 'SUPAUL', name: 'Supaul', type: 'district', lat: 26.1226, lng: 86.6060 },
  { id: 'PURNEA', name: 'Purnea', type: 'district', lat: 25.7771, lng: 87.4753 },
  { id: 'KATIHAR', name: 'Katihar', type: 'district', lat: 25.5394, lng: 87.5700 },
  { id: 'ARARIA', name: 'Araria', type: 'district', lat: 26.1512, lng: 87.4837 },
  { id: 'SITAMARHI', name: 'Sitamarhi', type: 'district', lat: 26.5900, lng: 85.4900 },
  { id: 'EAST_CHAMPARAN', name: 'East Champaran', type: 'district', lat: 26.6469, lng: 84.9170 },
]

export function getZone(id) {
  return ZONES.find((z) => z.id === id)
}
