// Bihar Flood 2026 — Response Simulation fixture data.
//
// District list, rivers, and the real-world scale/impact facts surfaced on
// the Alerts and Data Sources pages are grounded in public reporting on the
// actual September 2026 Bihar flood (Ganga/Kosi/Gandak/Bagmati river
// systems), gathered via web search on 2026-09-22:
//   - ~49 lakh (4.9M) people affected across the initial 15 districts, rising
//     to ~1.21 crore (12.1M) across 18 districts as the flood worsened —
//     Patna, Bhojpur, Saran, Vaishali, Bhagalpur, Begusarai, Buxar,
//     Samastipur, Munger, Katihar, Lakhisarai, Khagaria, Purnea, Madhepura,
//     Araria, plus Sitamarhi, West Champaran, and Kishanganj.
//   - 202 deaths reported (Araria 42, Sitamarhi 31, West Champaran 29 —
//     worst-hit districts by death toll).
//   - Ganga crossed its all-time Highest Flood Level at Gandhi Ghat (Patna)
//     and Sultanganj (Bhagalpur); Kosi, Gandak, Burhi Gandak, Bagmati, Punpun
//     and Ghaghra all ran above danger mark.
//   - NH104 (Sitamarhi) and NH31 (Kishanganj) submerged; railway stations at
//     Kishanganj, Katihar, and Jogbani (Araria) flooded, ~18 trains cancelled.
//   - 10 NDRF + 27 SDRF teams, 1,922 boats deployed; 1,336 relief camps
//     sheltering ~4.22 lakh people; 1,194 community kitchens operating.
//   Sources: India TV News, Sunday Guardian, National Herald, Deccan Herald,
//   Tech Times, The Express Tribune — see the in-app Data Sources page.
//
// Below that verified layer, specific OPERATIONAL figures (individual team
// assignments, resource pools, incident details, camp/medical bed-level
// status) are SIMULATED for this demonstration — no public source publishes
// live per-unit dispatch/bed data at that granularity — and do not represent
// live government data. See the in-app "Data Sources" page for the
// distinction between the two layers.

export const DISTRICTS = [
  {
    id: 'BHAGALPUR', name: 'Bhagalpur', river: 'Ganga', riskLevel: 'CRITICAL', status: 'ACTIVE_RESPONSE',
    responseType: 'Evacuation + Relief', affectedArea: 'Low-lying riverine areas near Naugachia and the Ganga embankment',
    priorityNeeds: ['Boat evacuation', 'Drinking water', 'Food supplies', 'Medical support'],
  },
  {
    id: 'MUNGER', name: 'Munger', river: 'Ganga', riskLevel: 'HIGH', status: 'MONITORING',
    responseType: 'Monitoring + Relief', affectedArea: 'Riverside colonies along the Ganga south bank',
    priorityNeeds: ['Evacuation readiness', 'Shelter capacity', 'Boat standby'],
  },
  {
    id: 'PATNA', name: 'Patna', river: 'Ganga', riskLevel: 'HIGH', status: 'MONITORING',
    responseType: 'Embankment Monitoring + Evacuation Readiness', affectedArea: 'Diara and low-lying riverine belts along the Ganga; Ganga crossed its all-time highest flood level at Gandhi Ghat',
    priorityNeeds: ['Embankment monitoring', 'Evacuation readiness', 'Drainage pumping'],
  },
  {
    id: 'VAISHALI', name: 'Vaishali', river: 'Ganga', riskLevel: 'HIGH', status: 'RELIEF_OPERATIONS',
    responseType: 'Relief Operations', affectedArea: 'Waterlogged blocks near the Ganga–Gandak confluence',
    priorityNeeds: ['Drinking water', 'Food supplies', 'Medical support'],
  },
  {
    id: 'BEGUSARAI', name: 'Begusarai', river: 'Ganga', riskLevel: 'HIGH', status: 'ACTIVE_RESPONSE',
    responseType: 'Evacuation + Relief', affectedArea: 'Riverine villages along the Ganga and Burhi Gandak',
    priorityNeeds: ['Boat evacuation', 'Temporary shelter', 'Food supplies'],
  },
  {
    id: 'BHOJPUR', name: 'Bhojpur', river: 'Ganga', riskLevel: 'MONITORING', status: 'MONITORING',
    responseType: 'Monitoring', affectedArea: 'Low-lying stretches along the Ganga near Ara',
    priorityNeeds: ['Embankment monitoring', 'Drainage pumping'],
  },
  {
    id: 'SARAN', name: 'Saran', river: 'Ganga / Ghaghra', riskLevel: 'HIGH', status: 'ACTIVE_RESPONSE',
    responseType: 'Evacuation + Relief', affectedArea: 'Low-lying blocks near the Ganga–Ghaghra confluence around Chapra',
    priorityNeeds: ['Boat evacuation', 'Drinking water', 'Temporary shelter'],
  },
  {
    id: 'BUXAR', name: 'Buxar', river: 'Ganga', riskLevel: 'MONITORING', status: 'MONITORING',
    responseType: 'Monitoring', affectedArea: 'Riverine belt along the Ganga upstream of Bhojpur',
    priorityNeeds: ['Embankment monitoring', 'Evacuation readiness'],
  },
  {
    id: 'KHAGARIA', name: 'Khagaria', river: 'Ganga / Burhi Gandak / Kosi confluence', riskLevel: 'CRITICAL', status: 'ACTIVE_RESPONSE',
    responseType: 'Evacuation + Relief', affectedArea: 'Villages at the tri-river confluence belt',
    priorityNeeds: ['Boat evacuation', 'Medical support', 'Food supplies', 'Temporary shelter'],
  },
  {
    id: 'SAMASTIPUR', name: 'Samastipur', river: 'Burhi Gandak / Bagmati', riskLevel: 'HIGH', status: 'RELIEF_OPERATIONS',
    responseType: 'Relief Operations', affectedArea: 'Waterlogged rural blocks along the Burhi Gandak',
    priorityNeeds: ['Drinking water', 'Food supplies', 'Temporary shelter'],
  },
  {
    id: 'DARBHANGA', name: 'Darbhanga', river: 'Bagmati / Kamla Balan', riskLevel: 'HIGH', status: 'ACTIVE_RESPONSE',
    responseType: 'Evacuation + Relief', affectedArea: 'Low-lying blocks along the Bagmati and Kamla Balan',
    priorityNeeds: ['Boat evacuation', 'Medical support', 'Drinking water'],
  },
  {
    id: 'LAKHISARAI', name: 'Lakhisarai', river: 'Ganga / Kiul', riskLevel: 'MONITORING', status: 'MONITORING',
    responseType: 'Monitoring', affectedArea: 'Riverine blocks along the Ganga and Kiul near Munger',
    priorityNeeds: ['Embankment monitoring', 'Evacuation readiness'],
  },
  {
    id: 'SAHARSA', name: 'Saharsa', river: 'Kosi', riskLevel: 'CRITICAL', status: 'EVACUATION_REQUIRED',
    responseType: 'Evacuation + Relief', affectedArea: 'Kosi diara villages and embankment-adjacent settlements',
    priorityNeeds: ['Boat evacuation', 'Food supplies', 'Medical support', 'Temporary shelter'],
  },
  {
    id: 'SUPAUL', name: 'Supaul', river: 'Kosi', riskLevel: 'HIGH', status: 'ACTIVE_RESPONSE',
    responseType: 'Evacuation + Relief', affectedArea: 'Kosi embankment villages near the barrage',
    priorityNeeds: ['Boat evacuation', 'Drinking water', 'Medical support'],
  },
  {
    id: 'MADHEPURA', name: 'Madhepura', river: 'Kosi', riskLevel: 'HIGH', status: 'ACTIVE_RESPONSE',
    responseType: 'Evacuation + Relief', affectedArea: 'Kosi basin blocks among the districts most severely hit by this flood',
    priorityNeeds: ['Boat evacuation', 'Drinking water', 'Food supplies'],
  },
  {
    id: 'PURNEA', name: 'Purnea', river: 'Kosi / Mahananda', riskLevel: 'HIGH', status: 'RELIEF_OPERATIONS',
    responseType: 'Relief Operations', affectedArea: 'Low-lying blocks near the Kosi–Mahananda system',
    priorityNeeds: ['Food supplies', 'Drinking water', 'Temporary shelter'],
  },
  {
    id: 'KATIHAR', name: 'Katihar', river: 'Ganga / Mahananda', riskLevel: 'MONITORING', status: 'MONITORING',
    responseType: 'Monitoring', affectedArea: 'Riverine belt near the Ganga–Mahananda confluence; Katihar railway station flooded',
    priorityNeeds: ['Embankment monitoring', 'Evacuation readiness'],
  },
  {
    id: 'ARARIA', name: 'Araria', river: 'Kosi / Parman', riskLevel: 'CRITICAL', status: 'EVACUATION_REQUIRED',
    responseType: 'Evacuation + Relief', affectedArea: 'Flood-prone blocks along the Parman and Kosi tributaries; highest reported district death toll (42) in this flood, Jogbani railway station flooded',
    priorityNeeds: ['Boat evacuation', 'Medical support', 'Food supplies'],
  },
  {
    id: 'KISHANGANJ', name: 'Kishanganj', river: 'Mahananda', riskLevel: 'CRITICAL', status: 'EVACUATION_REQUIRED',
    responseType: 'Evacuation + Relief', affectedArea: 'NH31 submerged and the district railway station flooded, cutting road and rail access; stranded passengers reported',
    priorityNeeds: ['Boat evacuation', 'Alternate route coordination', 'Food supplies', 'Drinking water'],
  },
  {
    id: 'SITAMARHI', name: 'Sitamarhi', river: 'Bagmati / Lakhandei', riskLevel: 'CRITICAL', status: 'EVACUATION_REQUIRED',
    responseType: 'Relief Operations', affectedArea: 'Waterlogged villages along the Bagmati and Lakhandei; NH104 submerged; second-highest reported district death toll (31)',
    priorityNeeds: ['Drinking water', 'Food supplies', 'Medical support', 'Alternate route coordination'],
  },
  {
    id: 'WEST_CHAMPARAN', name: 'West Champaran', river: 'Gandak / Lalbakeya', riskLevel: 'CRITICAL', status: 'ACTIVE_RESPONSE',
    responseType: 'Evacuation + Relief', affectedArea: 'Gandak embankment villages near the Nepal border belt; third-highest reported district death toll (29)',
    priorityNeeds: ['Boat evacuation', 'Medical support', 'Embankment monitoring'],
  },
]

// Sparse inter-district route network for the routing/replanning engine.
// Distances are approximate road distances between district headquarters —
// simulation routing weights, not live traffic data. Two segments are marked
// DANGEROUS/BLOCKED to reflect real, publicly reported closures on this
// flood: NH104 near Sitamarhi and NH31 near Kishanganj were both reported
// submerged.
export const ROADS = [
  { roadId: 'R1', from: 'BASE', to: 'PATNA', distanceKm: 12, travelTimeMin: 22, status: 'OPEN', risk: 2 },
  { roadId: 'R2', from: 'BASE', to: 'VAISHALI', distanceKm: 35, travelTimeMin: 50, status: 'OPEN', risk: 2 },
  { roadId: 'R3', from: 'BASE', to: 'BHOJPUR', distanceKm: 45, travelTimeMin: 60, status: 'OPEN', risk: 1 },
  { roadId: 'R4', from: 'BASE', to: 'SAMASTIPUR', distanceKm: 90, travelTimeMin: 130, status: 'OPEN', risk: 2 },
  { roadId: 'R5', from: 'VAISHALI', to: 'BEGUSARAI', distanceKm: 80, travelTimeMin: 120, status: 'OPEN', risk: 2 },
  { roadId: 'R6', from: 'BEGUSARAI', to: 'KHAGARIA', distanceKm: 45, travelTimeMin: 70, status: 'CONGESTED', risk: 3 },
  { roadId: 'R7', from: 'KHAGARIA', to: 'MUNGER', distanceKm: 55, travelTimeMin: 85, status: 'OPEN', risk: 2 },
  { roadId: 'R8', from: 'MUNGER', to: 'BHAGALPUR', distanceKm: 65, travelTimeMin: 100, status: 'OPEN', risk: 3 },
  { roadId: 'R9', from: 'KHAGARIA', to: 'SAHARSA', distanceKm: 60, travelTimeMin: 95, status: 'DANGEROUS', risk: 4 },
  { roadId: 'R10', from: 'SAHARSA', to: 'SUPAUL', distanceKm: 40, travelTimeMin: 65, status: 'OPEN', risk: 3 },
  { roadId: 'R11', from: 'SAHARSA', to: 'PURNEA', distanceKm: 95, travelTimeMin: 140, status: 'CONGESTED', risk: 3 },
  { roadId: 'R12', from: 'PURNEA', to: 'KATIHAR', distanceKm: 50, travelTimeMin: 75, status: 'OPEN', risk: 2 },
  { roadId: 'R13', from: 'PURNEA', to: 'ARARIA', distanceKm: 60, travelTimeMin: 90, status: 'OPEN', risk: 2 },
  { roadId: 'R14', from: 'KATIHAR', to: 'BHAGALPUR', distanceKm: 70, travelTimeMin: 105, status: 'OPEN', risk: 2 },
  { roadId: 'R15', from: 'BASE', to: 'SAMASTIPUR', distanceKm: 90, travelTimeMin: 130, status: 'OPEN', risk: 1 },
  { roadId: 'R16', from: 'SAMASTIPUR', to: 'DARBHANGA', distanceKm: 45, travelTimeMin: 70, status: 'OPEN', risk: 2 },
  // NH104 near Sitamarhi reported submerged — routed as DANGEROUS.
  { roadId: 'R17', from: 'DARBHANGA', to: 'SITAMARHI', distanceKm: 65, travelTimeMin: 95, status: 'DANGEROUS', risk: 4 },
  { roadId: 'R18', from: 'SITAMARHI', to: 'WEST_CHAMPARAN', distanceKm: 60, travelTimeMin: 90, status: 'CONGESTED', risk: 3 },
  { roadId: 'R19', from: 'BASE', to: 'WEST_CHAMPARAN', distanceKm: 170, travelTimeMin: 220, status: 'OPEN', risk: 1 },
  { roadId: 'R20', from: 'SAMASTIPUR', to: 'BEGUSARAI', distanceKm: 55, travelTimeMin: 80, status: 'OPEN', risk: 2 },
  { roadId: 'R21', from: 'DARBHANGA', to: 'SAHARSA', distanceKm: 100, travelTimeMin: 150, status: 'OPEN', risk: 2 },
  { roadId: 'R22', from: 'BASE', to: 'KHAGARIA', distanceKm: 130, travelTimeMin: 180, status: 'OPEN', risk: 2 },
  { roadId: 'R23', from: 'BASE', to: 'SARAN', distanceKm: 55, travelTimeMin: 80, status: 'OPEN', risk: 2 },
  { roadId: 'R24', from: 'SARAN', to: 'BUXAR', distanceKm: 60, travelTimeMin: 90, status: 'OPEN', risk: 2 },
  { roadId: 'R25', from: 'BUXAR', to: 'BHOJPUR', distanceKm: 45, travelTimeMin: 65, status: 'OPEN', risk: 1 },
  { roadId: 'R26', from: 'MUNGER', to: 'LAKHISARAI', distanceKm: 35, travelTimeMin: 55, status: 'OPEN', risk: 2 },
  { roadId: 'R27', from: 'SAHARSA', to: 'MADHEPURA', distanceKm: 35, travelTimeMin: 55, status: 'CONGESTED', risk: 3 },
  // NH31 near Kishanganj reported submerged, plus the district's railway
  // station flooded — routed as BLOCKED (no viable direct road link).
  { roadId: 'R28', from: 'KATIHAR', to: 'KISHANGANJ', distanceKm: 75, travelTimeMin: 999, status: 'BLOCKED', risk: 5 },
  // Longer rural diversion via Araria — the only way relief convoys can
  // still reach Kishanganj while NH31 is submerged.
  { roadId: 'R29', from: 'ARARIA', to: 'KISHANGANJ', distanceKm: 85, travelTimeMin: 150, status: 'DANGEROUS', risk: 4 },
]

export const TEAMS = [
  { name: 'SDRF Team 1 — Bhagalpur', type: 'RESCUE', agency: 'SDRF', status: 'EN_ROUTE', location: 'MUNGER', resources: ['Rescue Boats', 'Life Jackets'] },
  { name: 'NDRF Team 4 — Bhagalpur', type: 'RESCUE', agency: 'NDRF', status: 'BUSY', location: 'BHAGALPUR', resources: ['Rescue Boats', 'Rescue Equipment'] },
  { name: 'SDRF Team 2 — Munger', type: 'RESCUE', agency: 'SDRF', status: 'AVAILABLE', location: 'MUNGER', resources: ['Rescue Boats'] },
  { name: 'Medical Response Team — Patna', type: 'MEDICAL', agency: 'MEDICAL', status: 'AVAILABLE', location: 'PATNA', resources: ['Ambulances', 'Medical Kits'] },
  { name: 'Flood Evacuation Unit — Vaishali', type: 'EVACUATION', agency: 'CIVIL_DEFENCE', status: 'AVAILABLE', location: 'VAISHALI', resources: ['Buses'] },
  { name: 'SDRF Team 3 — Begusarai', type: 'RESCUE', agency: 'SDRF', status: 'AVAILABLE', location: 'BEGUSARAI', resources: ['Rescue Boats', 'Life Jackets'] },
  { name: 'NDRF Team 6 — Khagaria', type: 'RESCUE', agency: 'NDRF', status: 'EN_ROUTE', location: 'KHAGARIA', resources: ['Rescue Boats'] },
  { name: 'Medical Response Team — Khagaria', type: 'MEDICAL', agency: 'MEDICAL', status: 'BUSY', location: 'KHAGARIA', resources: ['Medical Kits'] },
  { name: 'Water Rescue Unit — Samastipur', type: 'WATER', agency: 'STATE_DISASTER_RESPONSE', status: 'AVAILABLE', location: 'SAMASTIPUR', resources: ['Water Rescue Kits'] },
  { name: 'SDRF Team 5 — Darbhanga', type: 'RESCUE', agency: 'SDRF', status: 'AVAILABLE', location: 'DARBHANGA', resources: ['Rescue Boats'] },
  { name: 'NDRF Team 2 — Saharsa', type: 'RESCUE', agency: 'NDRF', status: 'EN_ROUTE', location: 'SAHARSA', resources: ['Rescue Boats', 'Life Jackets'] },
  { name: 'Flood Evacuation Unit — Supaul', type: 'EVACUATION', agency: 'CIVIL_DEFENCE', status: 'AVAILABLE', location: 'SUPAUL', resources: ['Buses'] },
  { name: 'SDRF Team 7 — Purnea', type: 'RESCUE', agency: 'SDRF', status: 'AVAILABLE', location: 'PURNEA', resources: ['Rescue Boats'] },
  { name: 'Medical Response Team — Araria', type: 'MEDICAL', agency: 'MEDICAL', status: 'AVAILABLE', location: 'ARARIA', resources: ['Ambulances'] },
  { name: 'Civil Defence Unit — Sitamarhi', type: 'EVACUATION', agency: 'CIVIL_DEFENCE', status: 'UNAVAILABLE', location: 'SITAMARHI', resources: ['Buses'] },
  { name: 'SDRF Team 8 — Saran', type: 'RESCUE', agency: 'SDRF', status: 'AVAILABLE', location: 'SARAN', resources: ['Rescue Boats'] },
  { name: 'NDRF Team 9 — Kishanganj', type: 'RESCUE', agency: 'NDRF', status: 'BUSY', location: 'KISHANGANJ', resources: ['Rescue Boats', 'Rescue Equipment'] },
  { name: 'SDRF Team 10 — Madhepura', type: 'RESCUE', agency: 'SDRF', status: 'EN_ROUTE', location: 'MADHEPURA', resources: ['Rescue Boats', 'Life Jackets'] },
  { name: 'Civil Defence Unit — West Champaran', type: 'EVACUATION', agency: 'CIVIL_DEFENCE', status: 'AVAILABLE', location: 'WEST_CHAMPARAN', resources: ['Buses'] },
  { name: 'Water Rescue Unit — Lakhisarai', type: 'WATER', agency: 'STATE_DISASTER_RESPONSE', status: 'AVAILABLE', location: 'LAKHISARAI', resources: ['Water Rescue Kits'] },
]

export const RESOURCES = [
  { name: 'Rescue Boats', category: 'BOAT', unit: 'units', region: 'BHAGALPUR', purpose: 'Evacuation of stranded residents', total: 24, available: 10, allocated: 12, consumed: 2, status: 'DEPLOYED' },
  { name: 'Rescue Boats', category: 'BOAT', unit: 'units', region: 'SAHARSA', purpose: 'Kosi diara evacuation', total: 18, available: 6, allocated: 10, consumed: 2, status: 'CRITICAL_SHORTAGE' },
  { name: 'Ambulances', category: 'AMBULANCE', unit: 'units', region: 'PATNA', purpose: 'Emergency medical transport', total: 20, available: 12, allocated: 8, consumed: 0, status: 'AVAILABLE' },
  { name: 'Medical Kits', category: 'MEDICAL_KIT', unit: 'kits', region: 'KHAGARIA', purpose: 'Field medical response', total: 300, available: 140, allocated: 150, consumed: 10, status: 'DEPLOYED' },
  { name: 'Drinking Water', category: 'WATER', unit: 'liters', region: 'VAISHALI', purpose: 'Relief camp distribution', total: 30000, available: 12000, allocated: 16000, consumed: 2000, status: 'DEPLOYED' },
  { name: 'Food Rations', category: 'FOOD', unit: 'packets', region: 'BEGUSARAI', purpose: 'Relief camp and kitchen supply', total: 10000, available: 4200, allocated: 5000, consumed: 800, status: 'DEPLOYED' },
  { name: 'Life Jackets', category: 'LIFE_JACKET', unit: 'units', region: 'BHAGALPUR', purpose: 'Boat evacuation safety equipment', total: 400, available: 120, allocated: 260, consumed: 20, status: 'STANDBY' },
  { name: 'Fuel Reserves', category: 'FUEL', unit: 'liters', region: null, purpose: 'Boat and vehicle fleet resupply', total: 6000, available: 3400, allocated: 2200, consumed: 400, status: 'AVAILABLE' },
  { name: 'Rescue Equipment', category: 'EQUIPMENT', unit: 'sets', region: 'SAHARSA', purpose: 'Structural and water rescue operations', total: 45, available: 9, allocated: 30, consumed: 6, status: 'MAINTENANCE' },
  { name: 'Drinking Water', category: 'WATER', unit: 'liters', region: 'DARBHANGA', purpose: 'Relief camp distribution', total: 20000, available: 15000, allocated: 4500, consumed: 500, status: 'STANDBY' },
  { name: 'Food Rations', category: 'FOOD', unit: 'packets', region: 'KISHANGANJ', purpose: 'Supply for stranded rail passengers and evacuees after NH31 and rail access were cut', total: 8000, available: 1800, allocated: 5800, consumed: 400, status: 'CRITICAL_SHORTAGE' },
  { name: 'Rescue Boats', category: 'BOAT', unit: 'units', region: 'MADHEPURA', purpose: 'Kosi basin evacuation', total: 16, available: 5, allocated: 9, consumed: 2, status: 'DEPLOYED' },
]

export const MEDICAL_UNITS = [
  { name: 'Bhagalpur Medical College Flood Response Unit', district: 'BHAGALPUR', facilityType: 'HOSPITAL', doctorsStatus: 'HIGH_DEMAND', ambulanceStatus: 'LIMITED', medicineStatus: 'LIMITED', priorityCases: 'CRITICAL', accessibility: 'PARTIALLY_ACCESSIBLE', status: 'CRITICAL' },
  { name: 'Naugachia Medical Camp', district: 'BHAGALPUR', facilityType: 'MEDICAL_CAMP', doctorsStatus: 'LIMITED', ambulanceStatus: 'LIMITED', medicineStatus: 'AVAILABLE', priorityCases: 'HIGH', accessibility: 'DIFFICULT', status: 'HIGH_DEMAND' },
  { name: 'Munger Sadar Hospital', district: 'MUNGER', facilityType: 'HOSPITAL', doctorsStatus: 'AVAILABLE', ambulanceStatus: 'AVAILABLE', medicineStatus: 'AVAILABLE', priorityCases: 'MODERATE', accessibility: 'ACCESSIBLE', status: 'AVAILABLE' },
  { name: 'Patna Medical College Flood Cell', district: 'PATNA', facilityType: 'HOSPITAL', doctorsStatus: 'AVAILABLE', ambulanceStatus: 'AVAILABLE', medicineStatus: 'AVAILABLE', priorityCases: 'LOW', accessibility: 'ACCESSIBLE', status: 'AVAILABLE' },
  { name: 'Vaishali Relief Medical Camp', district: 'VAISHALI', facilityType: 'MEDICAL_CAMP', doctorsStatus: 'LIMITED', ambulanceStatus: 'AVAILABLE', medicineStatus: 'LIMITED', priorityCases: 'HIGH', accessibility: 'ACCESSIBLE', status: 'LIMITED' },
  { name: 'Khagaria Ambulance Post', district: 'KHAGARIA', facilityType: 'AMBULANCE_POST', doctorsStatus: 'LIMITED', ambulanceStatus: 'HIGH_DEMAND', medicineStatus: 'LIMITED', priorityCases: 'CRITICAL', accessibility: 'DIFFICULT', status: 'CRITICAL' },
  { name: 'Saharsa Sadar Hospital', district: 'SAHARSA', facilityType: 'HOSPITAL', doctorsStatus: 'HIGH_DEMAND', ambulanceStatus: 'LIMITED', medicineStatus: 'LIMITED', priorityCases: 'CRITICAL', accessibility: 'PARTIALLY_ACCESSIBLE', status: 'CRITICAL' },
  { name: 'Purnea Relief Medical Camp', district: 'PURNEA', facilityType: 'MEDICAL_CAMP', doctorsStatus: 'AVAILABLE', ambulanceStatus: 'AVAILABLE', medicineStatus: 'AVAILABLE', priorityCases: 'MODERATE', accessibility: 'ACCESSIBLE', status: 'AVAILABLE' },
  { name: 'Araria Sadar Hospital', district: 'ARARIA', facilityType: 'HOSPITAL', doctorsStatus: 'HIGH_DEMAND', ambulanceStatus: 'LIMITED', medicineStatus: 'LIMITED', priorityCases: 'CRITICAL', accessibility: 'DIFFICULT', status: 'CRITICAL' },
  { name: 'Sitamarhi Sadar Hospital', district: 'SITAMARHI', facilityType: 'HOSPITAL', doctorsStatus: 'HIGH_DEMAND', ambulanceStatus: 'LIMITED', medicineStatus: 'LIMITED', priorityCases: 'CRITICAL', accessibility: 'PARTIALLY_ACCESSIBLE', status: 'CRITICAL' },
  { name: 'West Champaran Relief Medical Camp', district: 'WEST_CHAMPARAN', facilityType: 'MEDICAL_CAMP', doctorsStatus: 'LIMITED', ambulanceStatus: 'LIMITED', medicineStatus: 'LIMITED', priorityCases: 'CRITICAL', accessibility: 'DIFFICULT', status: 'CRITICAL' },
  { name: 'Kishanganj Relief Medical Camp', district: 'KISHANGANJ', facilityType: 'MEDICAL_CAMP', doctorsStatus: 'LIMITED', ambulanceStatus: 'HIGH_DEMAND', medicineStatus: 'LIMITED', priorityCases: 'HIGH', accessibility: 'DIFFICULT', status: 'CRITICAL' },
]

export const RELIEF_CAMPS = [
  { name: 'Bhagalpur Flood Relief Centre', district: 'BHAGALPUR', location: 'Near Naugachia block office', capacityStatus: 'NEAR_CAPACITY', facilities: ['FOOD', 'DRINKING_WATER', 'MEDICAL_ASSISTANCE', 'TEMPORARY_SHELTER'], accessibility: 'PARTIALLY_ACCESSIBLE', status: 'ACTIVE' },
  { name: 'Munger Riverside Relief Camp', district: 'MUNGER', location: 'Munger town higher-ground school', capacityStatus: 'AVAILABLE', facilities: ['FOOD', 'DRINKING_WATER', 'TEMPORARY_SHELTER'], accessibility: 'ACCESSIBLE', status: 'ACTIVE' },
  { name: 'Patna Diara Relief Camp', district: 'PATNA', location: 'Riverine belt community hall', capacityStatus: 'AVAILABLE', facilities: ['FOOD', 'DRINKING_WATER'], accessibility: 'ACCESSIBLE', status: 'SETTING_UP' },
  { name: 'Vaishali Relief Camp', district: 'VAISHALI', location: 'Hajipur block relief centre', capacityStatus: 'NEAR_CAPACITY', facilities: ['FOOD', 'DRINKING_WATER', 'MEDICAL_ASSISTANCE', 'TEMPORARY_SHELTER'], accessibility: 'ACCESSIBLE', status: 'ACTIVE' },
  { name: 'Begusarai Relief Camp', district: 'BEGUSARAI', location: 'Panchayat bhawan, riverine block', capacityStatus: 'AVAILABLE', facilities: ['FOOD', 'TEMPORARY_SHELTER'], accessibility: 'PARTIALLY_ACCESSIBLE', status: 'ACTIVE' },
  { name: 'Khagaria Confluence Relief Camp', district: 'KHAGARIA', location: 'Higher-ground school near confluence belt', capacityStatus: 'FULL', facilities: ['FOOD', 'DRINKING_WATER', 'MEDICAL_ASSISTANCE', 'TEMPORARY_SHELTER'], accessibility: 'DIFFICULT', status: 'ACTIVE' },
  { name: 'Samastipur Relief Camp', district: 'SAMASTIPUR', location: 'Block-level community centre', capacityStatus: 'AVAILABLE', facilities: ['FOOD', 'DRINKING_WATER'], accessibility: 'ACCESSIBLE', status: 'ACTIVE' },
  { name: 'Darbhanga Relief Camp', district: 'DARBHANGA', location: 'Higher-ground government school', capacityStatus: 'NEAR_CAPACITY', facilities: ['FOOD', 'DRINKING_WATER', 'MEDICAL_ASSISTANCE'], accessibility: 'ACCESSIBLE', status: 'ACTIVE' },
  { name: 'Saharsa Kosi Relief Camp', district: 'SAHARSA', location: 'Embankment-adjacent relief centre', capacityStatus: 'FULL', facilities: ['FOOD', 'DRINKING_WATER', 'MEDICAL_ASSISTANCE', 'TEMPORARY_SHELTER'], accessibility: 'DIFFICULT', status: 'ACTIVE' },
  { name: 'Purnea Relief Camp', district: 'PURNEA', location: 'District relief coordination centre', capacityStatus: 'AVAILABLE', facilities: ['FOOD', 'DRINKING_WATER', 'TEMPORARY_SHELTER'], accessibility: 'ACCESSIBLE', status: 'ACTIVE' },
  { name: 'Araria Relief Camp', district: 'ARARIA', location: 'Jogbani higher-ground relief centre', capacityStatus: 'FULL', facilities: ['FOOD', 'DRINKING_WATER', 'MEDICAL_ASSISTANCE', 'TEMPORARY_SHELTER'], accessibility: 'DIFFICULT', status: 'ACTIVE' },
  { name: 'Sitamarhi Relief Camp', district: 'SITAMARHI', location: 'Higher-ground block office near NH104', capacityStatus: 'FULL', facilities: ['FOOD', 'DRINKING_WATER', 'MEDICAL_ASSISTANCE', 'TEMPORARY_SHELTER'], accessibility: 'DIFFICULT', status: 'ACTIVE' },
  { name: 'West Champaran Relief Camp', district: 'WEST_CHAMPARAN', location: 'Bettiah higher-ground school', capacityStatus: 'NEAR_CAPACITY', facilities: ['FOOD', 'DRINKING_WATER', 'MEDICAL_ASSISTANCE', 'TEMPORARY_SHELTER'], accessibility: 'PARTIALLY_ACCESSIBLE', status: 'ACTIVE' },
  { name: 'Kishanganj Relief Camp', district: 'KISHANGANJ', location: 'Near the flooded railway station', capacityStatus: 'FULL', facilities: ['FOOD', 'DRINKING_WATER', 'MEDICAL_ASSISTANCE', 'TEMPORARY_SHELTER'], accessibility: 'DIFFICULT', status: 'ACTIVE' },
]

export const COMMUNITY_KITCHENS = [
  { name: 'Community Kitchen — Bhagalpur', district: 'BHAGALPUR', location: 'Naugachia relief centre premises', status: 'ACTIVE', foodSupplyStatus: 'AVAILABLE', distributionStatus: 'ONGOING', priority: 'HIGH' },
  { name: 'Community Kitchen — Munger', district: 'MUNGER', location: 'Munger relief camp premises', status: 'ACTIVE', foodSupplyStatus: 'AVAILABLE', distributionStatus: 'ONGOING', priority: 'MEDIUM' },
  { name: 'Community Kitchen — Vaishali', district: 'VAISHALI', location: 'Hajipur relief centre premises', status: 'ACTIVE', foodSupplyStatus: 'LIMITED', distributionStatus: 'ONGOING', priority: 'HIGH' },
  { name: 'Community Kitchen — Begusarai', district: 'BEGUSARAI', location: 'Panchayat bhawan premises', status: 'SETTING_UP', foodSupplyStatus: 'LIMITED', distributionStatus: 'SCHEDULED', priority: 'MEDIUM' },
  { name: 'Community Kitchen — Khagaria', district: 'KHAGARIA', location: 'Confluence relief camp premises', status: 'ACTIVE', foodSupplyStatus: 'CRITICAL_SHORTAGE', distributionStatus: 'ONGOING', priority: 'HIGH' },
  { name: 'Community Kitchen — Saharsa', district: 'SAHARSA', location: 'Kosi relief camp premises', status: 'ACTIVE', foodSupplyStatus: 'CRITICAL_SHORTAGE', distributionStatus: 'ONGOING', priority: 'HIGH' },
  { name: 'Community Kitchen — Darbhanga', district: 'DARBHANGA', location: 'Government school relief camp premises', status: 'ACTIVE', foodSupplyStatus: 'AVAILABLE', distributionStatus: 'ONGOING', priority: 'MEDIUM' },
  { name: 'Community Kitchen — Purnea', district: 'PURNEA', location: 'District relief coordination centre premises', status: 'ACTIVE', foodSupplyStatus: 'AVAILABLE', distributionStatus: 'ONGOING', priority: 'LOW' },
  { name: 'Community Kitchen — Araria', district: 'ARARIA', location: 'Jogbani relief centre premises', status: 'ACTIVE', foodSupplyStatus: 'CRITICAL_SHORTAGE', distributionStatus: 'ONGOING', priority: 'HIGH' },
  { name: 'Community Kitchen — Sitamarhi', district: 'SITAMARHI', location: 'Block office relief centre premises', status: 'ACTIVE', foodSupplyStatus: 'CRITICAL_SHORTAGE', distributionStatus: 'ONGOING', priority: 'HIGH' },
  { name: 'Community Kitchen — West Champaran', district: 'WEST_CHAMPARAN', location: 'Bettiah relief centre premises', status: 'ACTIVE', foodSupplyStatus: 'LIMITED', distributionStatus: 'ONGOING', priority: 'HIGH' },
  { name: 'Community Kitchen — Kishanganj', district: 'KISHANGANJ', location: 'Relief camp near the railway station', status: 'ACTIVE', foodSupplyStatus: 'CRITICAL_SHORTAGE', distributionStatus: 'ONGOING', priority: 'HIGH' },
]

// ALERTS marked sourceType VERIFIED cite real, publicly reported facts about
// the September 2026 Bihar flood (see the header comment for sources). All
// other alerts are SIMULATED — generated by this app's response engine.
export const ALERTS = [
  {
    title: 'Bihar flood toll rises to 202 across 18 districts',
    message: '202 deaths reported as the flood widened from 15 to 18 districts; ~1.21 crore (12.1 million) people affected. Worst-hit by district death toll: Araria (42), Sitamarhi (31), West Champaran (29).',
    severity: 'CRITICAL', district: null, sourceType: 'VERIFIED', source: 'Deccan Herald / PTI, September 2026',
  },
  {
    title: 'NH104 and NH31 submerged — road access cut',
    message: 'National Highway 104 near Sitamarhi and National Highway 31 near Kishanganj are reported submerged. Travelers should expect diversions and avoid these stretches until authorities confirm they are passable.',
    severity: 'HIGH', district: null, sourceType: 'VERIFIED', source: 'The Express Tribune, September 2026',
  },
  {
    title: 'Railway stations flooded, trains cancelled',
    message: 'Railway stations at Kishanganj, Katihar, and Jogbani (Araria) were flooded, stranding passengers. Around 18 trains have been cancelled — check with Indian Railways before traveling through these stations.',
    severity: 'HIGH', district: null, sourceType: 'VERIFIED', source: 'The Express Tribune, September 2026',
  },
  {
    title: 'Ganga crosses all-time highest flood level at Patna',
    message: 'The Ganga crossed its previous Highest Flood Level (HFL) at Gandhi Ghat, Patna, and remained above the danger mark at Sultanganj (Bhagalpur), Digha, Hathidah, Kahalgaon, and Munger. Kosi, Gandak, Burhi Gandak, Bagmati, Punpun, and Ghaghra also ran above danger mark.',
    severity: 'HIGH', district: null, sourceType: 'VERIFIED', source: 'Sunday Guardian, September 2026',
  },
  {
    title: 'Relief scale: 1,336 camps, ~4.22 lakh sheltered',
    message: '1,336 relief camps have been set up statewide, sheltering approximately 4.22 lakh people. Earlier in the flood, 10 NDRF and 27 SDRF teams with 1,922 boats were deployed, running 1,194 community kitchens.',
    severity: 'INFORMATION', district: null, sourceType: 'VERIFIED', source: 'India TV News / Sunday Guardian, September 2026',
  },
  { title: 'Active flood response — Bhagalpur', message: 'Flood response remains active in vulnerable riverine areas of Bhagalpur, particularly near Naugachia.', severity: 'CRITICAL', district: 'BHAGALPUR', sourceType: 'SIMULATED', source: 'Response Simulation' },
  { title: 'Evacuation readiness — high-risk zones', message: 'Evacuation readiness required in high-risk zones, including Saharsa and Khagaria.', severity: 'HIGH', district: null, sourceType: 'SIMULATED', source: 'Response Simulation' },
  { title: 'Relief camps and kitchens operational', message: 'Relief camps and community kitchens remain operational in affected districts. Supply levels vary — see Resources for current status.', severity: 'MEDIUM', district: null, sourceType: 'SIMULATED', source: 'Response Simulation' },
  { title: 'Rescue prioritization', message: 'Rescue teams should prioritize stranded residents and medically vulnerable people in Bhagalpur and Saharsa.', severity: 'HIGH', district: null, sourceType: 'SIMULATED', source: 'Response Simulation' },
]

const INCIDENT_POOL = [
  { type: 'FLOOD', severity: 'CRITICAL', district: 'BHAGALPUR', description: 'River overflow near Naugachia has cut off several riverine villages; boat evacuation, food, and medical assistance required.', populationImpact: 'SEVERE', requiredResources: ['Rescue Boats', 'Food Rations', 'Medical Kits'] },
  { type: 'FLOOD', severity: 'HIGH', district: 'MUNGER', description: 'Rising Ganga river levels threaten low-lying colonies; evacuation readiness and shelter capacity being assessed.', populationImpact: 'LARGE', requiredResources: ['Rescue Boats', 'Drinking Water'] },
  { type: 'FLOOD', severity: 'HIGH', district: 'PATNA', description: 'Ganga crossed its all-time highest flood level at Gandhi Ghat; embankment monitoring underway along the Patna riverine belt as water levels remain elevated.', populationImpact: 'MODERATE', requiredResources: ['Rescue Teams'] },
  { type: 'FLOOD', severity: 'HIGH', district: 'VAISHALI', description: 'Waterlogging across low-lying blocks near the Ganga–Gandak confluence; relief operations active for drinking water, food, and medical support.', populationImpact: 'LARGE', requiredResources: ['Drinking Water', 'Food Rations', 'Medical Kits'] },
  { type: 'WATER_RESCUE', severity: 'CRITICAL', district: 'SAHARSA', description: 'Multiple families reported stranded on rooftops in Kosi diara villages as embankment water rises.', populationImpact: 'MODERATE', requiredResources: ['Rescue Boats', 'Life Jackets'] },
  { type: 'MEDICAL_EMERGENCY', severity: 'HIGH', district: 'KHAGARIA', description: 'Surge in waterborne illness cases reported at the confluence-belt relief camp.', populationImpact: 'MODERATE', requiredResources: ['Medical Kits', 'Ambulances'] },
  { type: 'INFRASTRUCTURE', severity: 'CRITICAL', district: 'SAHARSA', description: 'Kosi embankment showing signs of structural weakening near the barrage; close monitoring in progress.', populationImpact: 'LARGE', requiredResources: ['Rescue Teams', 'Equipment'] },
  { type: 'FLOOD', severity: 'HIGH', district: 'BEGUSARAI', description: 'Riverine villages along the Ganga and Burhi Gandak inundated; evacuation and relief operations active.', populationImpact: 'LARGE', requiredResources: ['Rescue Boats', 'Temporary Shelter'] },
  { type: 'FLOOD', severity: 'MEDIUM', district: 'SAMASTIPUR', description: 'Waterlogging reported across rural blocks along the Burhi Gandak; relief operations active.', populationImpact: 'MODERATE', requiredResources: ['Drinking Water', 'Food Rations'] },
  { type: 'FLOOD', severity: 'HIGH', district: 'DARBHANGA', description: 'Low-lying blocks along the Bagmati and Kamla Balan flooded; boat evacuation and medical support underway.', populationImpact: 'LARGE', requiredResources: ['Rescue Boats', 'Medical Kits'] },
  { type: 'WATER_RESCUE', severity: 'HIGH', district: 'SUPAUL', description: 'Boat capsized near a Kosi embankment village; occupants recovered, rescue teams remain on standby in the area.', populationImpact: 'LOCALIZED', requiredResources: ['Rescue Boats', 'Rescue Teams'] },
  { type: 'FLOOD', severity: 'MEDIUM', district: 'PURNEA', description: 'Low-lying blocks near the Kosi–Mahananda system waterlogged; relief operations for food and shelter active.', populationImpact: 'MODERATE', requiredResources: ['Food Rations', 'Temporary Shelter'] },
  { type: 'INFRASTRUCTURE', severity: 'MEDIUM', district: 'KATIHAR', description: 'Katihar railway station flooded; passengers stranded and services suspended pending water recession.', populationImpact: 'MODERATE', requiredResources: ['Equipment'] },
  { type: 'FLOOD', severity: 'CRITICAL', district: 'ARARIA', description: 'Flood-prone blocks along the Parman and Kosi tributaries inundated; district has the highest reported death toll (42) in this flood. Jogbani railway station flooded; evacuation and medical support underway.', populationImpact: 'SEVERE', requiredResources: ['Rescue Boats', 'Medical Kits'] },
  { type: 'MEDICAL_EMERGENCY', severity: 'MEDIUM', district: 'SITAMARHI', description: 'Elderly residents in a waterlogged block require evacuation for ongoing medical treatment.', populationImpact: 'LOCALIZED', requiredResources: ['Ambulances'] },
  { type: 'INFRASTRUCTURE', severity: 'CRITICAL', district: 'SITAMARHI', description: 'NH104 reported submerged, cutting the main road link through the district; alternate-route coordination required for relief convoys.', populationImpact: 'LARGE', requiredResources: ['Rescue Teams', 'Equipment'] },
  { type: 'INFRASTRUCTURE', severity: 'CRITICAL', district: 'WEST_CHAMPARAN', description: 'District has the third-highest reported death toll (29) in this flood; Gandak embankment near the Nepal border belt under close monitoring.', populationImpact: 'LARGE', requiredResources: ['Equipment', 'Rescue Teams'] },
  { type: 'ROAD_ACCIDENT', severity: 'LOW', district: 'BHOJPUR', description: 'Vehicle stranded on a partially waterlogged approach road; traffic diverted, no injuries reported.', populationImpact: 'LOCALIZED', requiredResources: [] },
  { type: 'FLOOD', severity: 'MEDIUM', district: 'BHOJPUR', description: 'Minor waterlogging reported along the Ganga stretch near Ara; embankment monitoring continues.', populationImpact: 'LOCALIZED', requiredResources: [] },
  { type: 'MEDICAL_EMERGENCY', severity: 'HIGH', district: 'BHAGALPUR', description: 'Multiple residents reporting waterborne illness symptoms at the Naugachia relief centre.', populationImpact: 'MODERATE', requiredResources: ['Medical Kits', 'Ambulances'] },
  { type: 'FLOOD', severity: 'MEDIUM', district: 'SARAN', description: 'Low-lying blocks near the Ganga–Ghaghra confluence around Chapra waterlogged; relief operations active.', populationImpact: 'MODERATE', requiredResources: ['Drinking Water', 'Temporary Shelter'] },
  { type: 'FLOOD', severity: 'LOW', district: 'BUXAR', description: 'Minor waterlogging along the Ganga riverine belt; embankment monitoring continues.', populationImpact: 'LOCALIZED', requiredResources: [] },
  { type: 'FLOOD', severity: 'LOW', district: 'LAKHISARAI', description: 'Minor waterlogging reported along the Ganga and Kiul stretch near Munger; monitoring continues.', populationImpact: 'LOCALIZED', requiredResources: [] },
  { type: 'FLOOD', severity: 'HIGH', district: 'MADHEPURA', description: 'Kosi basin flooding among the most severe reported in this event; villages inundated, boat evacuation underway.', populationImpact: 'LARGE', requiredResources: ['Rescue Boats', 'Drinking Water'] },
  { type: 'INFRASTRUCTURE', severity: 'CRITICAL', district: 'KISHANGANJ', description: 'NH31 reported submerged and the district railway station flooded, cutting both road and rail access; passengers stranded and relief convoys must use alternate routes.', populationImpact: 'LARGE', requiredResources: ['Rescue Teams', 'Equipment'] },
  { type: 'FLOOD', severity: 'HIGH', district: 'KISHANGANJ', description: 'Mahananda river flooding has inundated low-lying blocks; evacuation and relief operations active.', populationImpact: 'LARGE', requiredResources: ['Rescue Boats', 'Food Rations'] },
]

export function buildIncidents() {
  return INCIDENT_POOL.map((inc, i) => ({
    ...inc,
    incidentId: `INC-${String(i + 1).padStart(4, '0')}`,
    status: i % 6 === 0 ? 'MONITORING' : 'ACTIVE',
  }))
}
