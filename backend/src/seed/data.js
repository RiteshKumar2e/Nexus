// Fictional demo data for the "Patna Flood Response" simulation scenario.
// SIMULATION MODE — none of this represents real infrastructure or events.

export const ROADS = [
  { roadId: 'R1', from: 'BASE', to: 'ZoneB', distanceKm: 6.2, travelTimeMin: 9, status: 'OPEN', risk: 1 },
  { roadId: 'R2', from: 'BASE', to: 'ZoneA', distanceKm: 4.8, travelTimeMin: 7, status: 'OPEN', risk: 1 },
  { roadId: 'R3', from: 'BASE', to: 'ZoneD', distanceKm: 3.1, travelTimeMin: 5, status: 'OPEN', risk: 1 },
  { roadId: 'R4', from: 'ZoneD', to: 'ZoneB', distanceKm: 5.4, travelTimeMin: 8, status: 'OPEN', risk: 2 },
  { roadId: 'R5', from: 'ZoneA', to: 'ZoneD', distanceKm: 4.0, travelTimeMin: 6, status: 'OPEN', risk: 1 },
  { roadId: 'R6', from: 'ZoneA', to: 'ZoneC', distanceKm: 7.5, travelTimeMin: 11, status: 'OPEN', risk: 2 },
  { roadId: 'R7', from: 'ZoneD', to: 'ZoneC', distanceKm: 6.0, travelTimeMin: 10, status: 'OPEN', risk: 2 },
  { roadId: 'R8', from: 'ZoneC', to: 'ZoneE', distanceKm: 8.2, travelTimeMin: 13, status: 'OPEN', risk: 2 },
  { roadId: 'R9', from: 'BASE', to: 'ZoneC', distanceKm: 9.0, travelTimeMin: 15, status: 'CONGESTED', risk: 3 },
  { roadId: 'R10', from: 'ZoneB', to: 'ZoneC', distanceKm: 6.8, travelTimeMin: 10, status: 'OPEN', risk: 2 },
  { roadId: 'R11', from: 'ZoneE', to: 'ZoneD', distanceKm: 10.1, travelTimeMin: 16, status: 'OPEN', risk: 3 },
  { roadId: 'R12', from: 'ZoneB', to: 'ZoneE', distanceKm: 12.4, travelTimeMin: 19, status: 'CONGESTED', risk: 3 },
]

export const TEAMS = [
  { name: 'Team Alpha', type: 'RESCUE', status: 'AVAILABLE', location: 'BASE', resources: ['Boats', 'Rescue Equipment'] },
  { name: 'Team Bravo', type: 'MEDICAL', status: 'AVAILABLE', location: 'BASE', resources: ['Ambulances', 'Medical Kits'] },
  { name: 'Team Charlie', type: 'RESCUE', status: 'AVAILABLE', location: 'ZoneA', resources: ['Boats'] },
  { name: 'Team Delta', type: 'FIRE', status: 'AVAILABLE', location: 'ZoneD', resources: ['Fire Equipment'] },
  { name: 'Team Echo', type: 'WATER', status: 'BUSY', location: 'ZoneC', resources: ['Water Tankers'] },
  { name: 'Team Foxtrot', type: 'MEDICAL', status: 'AVAILABLE', location: 'ZoneE', resources: ['Ambulances'] },
  { name: 'Team Golf', type: 'EVACUATION', status: 'AVAILABLE', location: 'BASE', resources: ['Buses'] },
  { name: 'Team Hotel', type: 'RESCUE', status: 'EN_ROUTE', location: 'ZoneB', resources: ['Boats', 'Rope Kits'] },
  { name: 'Team India', type: 'FIRE', status: 'UNAVAILABLE', location: 'ZoneC', resources: ['Fire Equipment'] },
  { name: 'Team Juliet', type: 'WATER', status: 'AVAILABLE', location: 'ZoneA', resources: ['Water Tankers'] },
  { name: 'Team Kilo', type: 'MEDICAL', status: 'BUSY', location: 'ZoneD', resources: ['Medical Kits'] },
  { name: 'Team Lima', type: 'EVACUATION', status: 'AVAILABLE', location: 'ZoneE', resources: ['Buses'] },
]

export const RESOURCES = [
  { name: 'Ambulances', category: 'AMBULANCE', unit: 'units', total: 20, available: 14, allocated: 6, consumed: 0 },
  { name: 'Rescue Boats', category: 'BOAT', unit: 'units', total: 18, available: 11, allocated: 7, consumed: 0 },
  { name: 'Medical Kits', category: 'MEDICAL_KIT', unit: 'kits', total: 500, available: 340, allocated: 120, consumed: 40 },
  { name: 'Drinking Water', category: 'WATER', unit: 'liters', total: 40000, available: 26000, allocated: 10000, consumed: 4000 },
  { name: 'Food Rations', category: 'FOOD', unit: 'packets', total: 12000, available: 8200, allocated: 3000, consumed: 800 },
  { name: 'Fuel Reserves', category: 'FUEL', unit: 'liters', total: 8000, available: 5200, allocated: 2000, consumed: 800 },
  { name: 'Rescue Equipment', category: 'EQUIPMENT', unit: 'sets', total: 60, available: 38, allocated: 20, consumed: 2 },
]

export const HOSPITALS = [
  { name: 'Hospital H1 — Patna Medical', location: 'ZoneA', totalBeds: 220, availableBeds: 96, icuBeds: 30, icuAvailable: 12, emergencyCapacity: 40, currentLoadPct: 56 },
  { name: 'Hospital H2 — Kankarbagh General', location: 'ZoneB', totalBeds: 150, availableBeds: 27, icuBeds: 18, icuAvailable: 3, emergencyCapacity: 25, currentLoadPct: 82 },
  { name: 'Hospital H3 — Digha Community', location: 'ZoneC', totalBeds: 110, availableBeds: 58, icuBeds: 12, icuAvailable: 7, emergencyCapacity: 20, currentLoadPct: 47 },
  { name: 'Hospital H4 — Rajendra Nagar Trauma', location: 'ZoneD', totalBeds: 90, availableBeds: 34, icuBeds: 10, icuAvailable: 4, emergencyCapacity: 16, currentLoadPct: 62 },
  { name: 'Hospital H5 — Danapur Cantonment', location: 'ZoneE', totalBeds: 130, availableBeds: 71, icuBeds: 14, icuAvailable: 9, emergencyCapacity: 22, currentLoadPct: 39 },
]

export const SHELTERS = [
  { name: 'Shelter S1 — Patliputra High School', location: 'ZoneA', capacity: 600, occupied: 410 },
  { name: 'Shelter S2 — Kankarbagh Community Hall', location: 'ZoneB', capacity: 450, occupied: 315 },
  { name: 'Shelter S3 — Digha Sports Complex', location: 'ZoneC', capacity: 800, occupied: 260 },
  { name: 'Shelter S4 — Rajendra Nagar Stadium', location: 'ZoneD', capacity: 500, occupied: 190 },
  { name: 'Shelter S5 — Danapur Cantt Hall', location: 'ZoneE', capacity: 350, occupied: 120 },
  { name: 'Shelter S6 — Bailey Road Relief Camp', location: 'ZoneA', capacity: 300, occupied: 280 },
  { name: 'Shelter S7 — Gandhi Maidan Camp', location: 'BASE', capacity: 1000, occupied: 640 },
]

const INCIDENT_POOL = [
  { type: 'FLOOD', severity: 'CRITICAL', zone: 'ZoneB', description: 'Water levels rising rapidly along the Kankarbagh embankment, threatening low-lying homes.', affectedPopulation: 1800, requiredResources: ['Boats', 'Rescue Teams'] },
  { type: 'FLOOD', severity: 'HIGH', zone: 'ZoneA', description: 'Flash flooding has cut off two residential blocks in Patliputra colony.', affectedPopulation: 950, requiredResources: ['Boats', 'Drinking Water'] },
  { type: 'WATER_RESCUE', severity: 'CRITICAL', zone: 'ZoneB', description: 'Multiple families reported stranded on rooftops near the main canal.', affectedPopulation: 60, requiredResources: ['Boats', 'Rescue Teams'] },
  { type: 'MEDICAL_EMERGENCY', severity: 'HIGH', zone: 'ZoneC', description: 'Surge in waterborne illness cases reported at Digha relief camp.', affectedPopulation: 220, requiredResources: ['Medical Kits', 'Ambulances'] },
  { type: 'BUILDING_COLLAPSE', severity: 'CRITICAL', zone: 'ZoneD', description: 'Partial collapse of a waterlogged residential structure in Rajendra Nagar.', affectedPopulation: 40, requiredResources: ['Rescue Teams', 'Rescue Equipment'] },
  { type: 'INFRASTRUCTURE', severity: 'HIGH', zone: 'ZoneE', description: 'Embankment near Danapur showing signs of structural weakening.', affectedPopulation: 1200, requiredResources: ['Rescue Teams', 'Equipment'] },
  { type: 'ROAD_ACCIDENT', severity: 'MEDIUM', zone: 'ZoneA', description: 'Vehicle stranded mid-flood on a partially submerged road.', affectedPopulation: 4, requiredResources: ['Rescue Teams'] },
  { type: 'FIRE', severity: 'MEDIUM', zone: 'ZoneC', description: 'Electrical short circuit reported at a relief camp generator unit.', affectedPopulation: 300, requiredResources: ['Fire Equipment'] },
  { type: 'MEDICAL_EMERGENCY', severity: 'MEDIUM', zone: 'ZoneD', description: 'Elderly residents requiring evacuation for dialysis treatment.', affectedPopulation: 12, requiredResources: ['Ambulances'] },
  { type: 'FLOOD', severity: 'MEDIUM', zone: 'ZoneE', description: 'Minor waterlogging reported near Danapur cantonment perimeter.', affectedPopulation: 340, requiredResources: ['Water Tankers'] },
  { type: 'WATER_RESCUE', severity: 'HIGH', zone: 'ZoneC', description: 'Boat capsized near Digha ghat; occupants awaiting rescue.', affectedPopulation: 6, requiredResources: ['Boats', 'Rescue Teams'] },
  { type: 'INFRASTRUCTURE', severity: 'LOW', zone: 'ZoneA', description: 'Minor road subsidence reported near Patliputra colony gate.', affectedPopulation: 50, requiredResources: ['Equipment'] },
  { type: 'MEDICAL_EMERGENCY', severity: 'LOW', zone: 'ZoneB', description: 'Minor injuries reported during shelter relocation.', affectedPopulation: 8, requiredResources: ['Medical Kits'] },
  { type: 'FLOOD', severity: 'HIGH', zone: 'ZoneD', description: 'Drainage backup causing street-level flooding near the stadium shelter.', affectedPopulation: 700, requiredResources: ['Water Tankers', 'Rescue Teams'] },
  { type: 'ROAD_ACCIDENT', severity: 'LOW', zone: 'ZoneE', description: 'Minor collision reported on approach road, traffic backed up.', affectedPopulation: 3, requiredResources: [] },
  { type: 'BUILDING_COLLAPSE', severity: 'MEDIUM', zone: 'ZoneC', description: 'Boundary wall collapse reported, no injuries so far.', affectedPopulation: 15, requiredResources: ['Rescue Teams'] },
  { type: 'FIRE', severity: 'LOW', zone: 'ZoneA', description: 'Small kitchen fire contained at a community shelter.', affectedPopulation: 20, requiredResources: [] },
  { type: 'INFRASTRUCTURE', severity: 'HIGH', zone: 'ZoneB', description: 'Power substation partially flooded, intermittent outages reported.', affectedPopulation: 2500, requiredResources: ['Equipment'] },
]

export function buildIncidents() {
  return INCIDENT_POOL.map((inc, i) => ({
    ...inc,
    incidentId: `INC-${String(i + 1).padStart(4, '0')}`,
    status: i % 6 === 0 ? 'MONITORING' : 'ACTIVE',
  }))
}
