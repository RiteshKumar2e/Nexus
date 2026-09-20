import 'dotenv/config'
import { connectDB } from '../config/db.js'
import {
  sequelize,
  syncModels,
  User,
  Road,
  ResponseTeam,
  Resource,
  Hospital,
  Shelter,
  Incident,
  ResponsePlan,
  DecisionLog,
  SimulationState,
} from '../models/associations.js'
import { ROADS, TEAMS, RESOURCES, HOSPITALS, SHELTERS, buildIncidents } from './data.js'

function hospitalStatus(loadPct) {
  if (loadPct >= 90) return 'CRITICAL'
  if (loadPct >= 75) return 'WARNING'
  return 'NORMAL'
}

function shelterStatus(occupied, capacity) {
  const pct = occupied / capacity
  if (pct >= 1) return 'FULL'
  if (pct >= 0.85) return 'NEAR_CAPACITY'
  return 'AVAILABLE'
}

export async function seedDatabase() {
  // Drop and recreate every table for a clean, fully deterministic scenario reset.
  await syncModels({ force: true })

  await Promise.all([
    User.create({ name: 'Commander Rao', email: 'commander@nexus.io', password: 'password123', role: 'COMMANDER' }),
    User.create({ name: 'Operator Mehta', email: 'operator@nexus.io', password: 'password123', role: 'OPERATOR' }),
    User.create({ name: 'Observer Singh', email: 'viewer@nexus.io', password: 'password123', role: 'VIEWER' }),
  ])

  await Road.bulkCreate(ROADS)

  await ResponseTeam.bulkCreate(TEAMS)
  const teams = await ResponseTeam.findAll()

  await Resource.bulkCreate(
    RESOURCES.map((r) => ({ ...r, status: r.available / r.total < 0.15 ? 'CRITICAL' : r.available / r.total < 0.4 ? 'LOW' : 'HEALTHY' }))
  )

  await Hospital.bulkCreate(HOSPITALS.map((h) => ({ ...h, status: hospitalStatus(h.currentLoadPct) })))
  const hospitals = await Hospital.findAll()

  await Shelter.bulkCreate(SHELTERS.map((s) => ({ ...s, status: shelterStatus(s.occupied, s.capacity) })))
  const shelters = await Shelter.findAll()

  await Incident.bulkCreate(buildIncidents())
  const incidents = await Incident.findAll()

  // Seed the primary demo narrative: Team Alpha dispatched to Zone B via R1,
  // matching the hackathon walkthrough exactly (Road R1 blocked → replan).
  const alpha = teams.find((t) => t.name === 'Team Alpha')
  const criticalIncident = incidents.find((i) => i.zone === 'ZoneB' && i.severity === 'CRITICAL')
  alpha.currentAssignment = { zone: 'ZoneB', incidentId: criticalIncident?.id || null, route: ['BASE', 'ZoneB'], roadsUsed: ['R1'], eta: 9 }
  alpha.status = 'EN_ROUTE'
  await alpha.save()
  if (criticalIncident) {
    criticalIncident.assignedTeamId = alpha.id
    await criticalIncident.save()
  }

  const hospitalH2 = hospitals.find((h) => h.name.includes('H2'))
  const shelterS2 = shelters.find((s) => s.name.includes('S2'))

  const plan17 = await ResponsePlan.create(
    {
      planNumber: 17,
      status: 'ACTIVE',
      trigger: 'Initial dispatch — Zone B critical flood incident',
      incidentId: criticalIncident?.id || null,
      actions: [
        {
          type: 'TEAM_DISPATCH',
          teamId: alpha.id,
          fromNode: 'BASE',
          toNode: 'ZoneB',
          route: ['BASE', 'ZoneB'],
          roadsUsed: ['R1'],
          etaMin: 9,
          description: 'Team Alpha dispatched to Zone B via R1',
        },
        {
          type: 'AMBULANCE_TRANSPORT',
          hospitalId: hospitalH2?.id,
          description: `Casualties routed to ${hospitalH2?.name}`,
        },
        {
          type: 'EVACUATION',
          shelterId: shelterS2?.id,
          description: `Evacuees directed to ${shelterS2?.name}`,
        },
      ],
      affectedResources: ['Team Alpha', hospitalH2?.name, shelterS2?.name].filter(Boolean),
      estimatedImpact: 'ETA 9 min · 6.2 km',
      reasoning: 'Zone B flood incident requires immediate rescue and medical coordination.',
    },
    { include: [{ association: 'actions' }] }
  )

  await DecisionLog.create({
    decisionNumber: 101,
    trigger: 'Zone B critical flood incident reported',
    agents: ['Situation Agent', 'Planning Agent'],
    decision: 'Dispatch Team Alpha to Zone B via R1; route casualties to Hospital H2; evacuees to Shelter S2.',
    reason: 'Zone B shows the highest concentration of affected population and rising water levels.',
    result: 'Plan #17 activated. ETA 9 minutes.',
    status: 'EXECUTED',
    relatedPlanId: plan17.id,
  })

  await SimulationState.create({ scenario: 'PATNA FLOOD RESPONSE', status: 'RUNNING', startedAt: new Date(), populationAffected: 24800 })

  console.log('[seed] Database seeded successfully.')
  console.log('[seed] Demo accounts: commander@nexus.io / operator@nexus.io / viewer@nexus.io (password: password123)')
}

const isMain = process.argv[1] && process.argv[1].endsWith('seed.js')
if (isMain) {
  connectDB()
    .then(seedDatabase)
    .then(() => sequelize.close())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[seed] failed:', err)
      process.exit(1)
    })
}
