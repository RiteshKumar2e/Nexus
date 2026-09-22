import 'dotenv/config'
import { connectDB } from '../config/db.js'
import {
  sequelize,
  syncModels,
  User,
  Road,
  ResponseTeam,
  Resource,
  MedicalUnit,
  ReliefCamp,
  Incident,
  District,
  CommunityKitchen,
  Alert,
  ResponsePlan,
  PlanAction,
  DecisionLog,
  SimulationEvent,
  SimulationState,
} from '../models/associations.js'
import {
  ROADS,
  TEAMS,
  RESOURCES,
  MEDICAL_UNITS,
  RELIEF_CAMPS,
  COMMUNITY_KITCHENS,
  DISTRICTS,
  ALERTS,
  buildIncidents,
} from './data.js'

// Populates every scenario table (districts, roads, teams, incidents, plans,
// decision log, ...) from a clean slate. Does NOT touch the Users table —
// callers that need a fresh Users table too (only the CLI seed below) create
// those separately first.
async function seedScenarioData() {
  await District.bulkCreate(DISTRICTS)
  await Road.bulkCreate(ROADS)

  await ResponseTeam.bulkCreate(TEAMS)
  const teams = await ResponseTeam.findAll()

  await Resource.bulkCreate(RESOURCES)

  await MedicalUnit.bulkCreate(MEDICAL_UNITS)
  const medicalUnits = await MedicalUnit.findAll()

  await ReliefCamp.bulkCreate(RELIEF_CAMPS)
  const reliefCamps = await ReliefCamp.findAll()

  await CommunityKitchen.bulkCreate(COMMUNITY_KITCHENS)
  await Alert.bulkCreate(ALERTS)

  await Incident.bulkCreate(buildIncidents())
  const incidents = await Incident.findAll()

  // Seed the primary walkthrough narrative: SDRF Team 1 dispatched from Munger
  // to the critical Bhagalpur flood incident via R8, matching the hackathon
  // walkthrough exactly (Road R8 blocked → replan).
  const team1 = teams.find((t) => t.name === 'SDRF Team 1 — Bhagalpur')
  const criticalIncident = incidents.find((i) => i.district === 'BHAGALPUR' && i.severity === 'CRITICAL')
  team1.currentAssignment = { district: 'BHAGALPUR', incidentId: criticalIncident?.id || null, route: ['MUNGER', 'BHAGALPUR'], roadsUsed: ['R8'], eta: 100 }
  team1.status = 'EN_ROUTE'
  await team1.save()
  if (criticalIncident) {
    criticalIncident.assignedTeamId = team1.id
    await criticalIncident.save()
  }

  const medicalUnit = medicalUnits.find((m) => m.name.includes('Naugachia'))
  const reliefCamp = reliefCamps.find((c) => c.name.includes('Bhagalpur'))

  const plan17 = await ResponsePlan.create(
    {
      planNumber: 17,
      status: 'ACTIVE',
      trigger: 'Initial dispatch — Bhagalpur critical flood incident',
      incidentId: criticalIncident?.id || null,
      actions: [
        {
          type: 'TEAM_DISPATCH',
          teamId: team1.id,
          fromNode: 'MUNGER',
          toNode: 'BHAGALPUR',
          route: ['MUNGER', 'BHAGALPUR'],
          roadsUsed: ['R8'],
          etaMin: 100,
          description: 'SDRF Team 1 dispatched to Bhagalpur via R8',
        },
        {
          type: 'AMBULANCE_TRANSPORT',
          medicalUnitId: medicalUnit?.id,
          description: `Casualties routed to ${medicalUnit?.name}`,
        },
        {
          type: 'EVACUATION',
          reliefCampId: reliefCamp?.id,
          description: `Evacuees directed to ${reliefCamp?.name}`,
        },
      ],
      affectedResources: ['SDRF Team 1 — Bhagalpur', medicalUnit?.name, reliefCamp?.name].filter(Boolean),
      estimatedImpact: 'ETA 100 min · 65 km',
      reasoning: 'Bhagalpur flood incident requires immediate boat evacuation and medical coordination.',
    },
    { include: [{ association: 'actions' }] }
  )

  await DecisionLog.create({
    decisionNumber: 101,
    trigger: 'Bhagalpur critical flood incident reported',
    agents: ['Situation Agent', 'Planning Agent'],
    decision: 'Dispatch SDRF Team 1 to Bhagalpur via R8; route casualties to Naugachia Medical Camp; evacuees to Bhagalpur Flood Relief Centre.',
    reason: 'Bhagalpur shows the highest concentration of affected riverine villages and a rapidly rising Ganga.',
    result: 'Plan #17 activated. ETA 100 minutes.',
    status: 'EXECUTED',
    relatedPlanId: plan17.id,
  })

  await SimulationState.create({ scenario: 'BIHAR FLOOD RESPONSE 2026', status: 'RUNNING', startedAt: new Date() })
}

// Full reset for local/CI use: drops and recreates every table, including
// Users — only safe to run from the CLI against a database you're OK wiping
// completely. NEVER call this from an in-app request handler (see
// resetScenario below for the in-app "Reset" button's safe equivalent).
export async function seedDatabase() {
  await syncModels({ force: true })

  await Promise.all([
    User.create({ name: 'Commander Rao', email: 'commander@nexus.io', password: 'password123', role: 'COMMANDER' }),
    User.create({ name: 'Operator Mehta', email: 'operator@nexus.io', password: 'password123', role: 'OPERATOR' }),
    User.create({ name: 'Observer Singh', email: 'viewer@nexus.io', password: 'password123', role: 'VIEWER' }),
  ])

  await seedScenarioData()

  console.log('[seed] Database seeded successfully.')
  console.log('[seed] Demo accounts: commander@nexus.io / operator@nexus.io / viewer@nexus.io (password: password123)')
}

// In-app "Reset" button equivalent: clears and rebuilds every scenario table
// back to the initial walkthrough state, WITHOUT ever touching Users or
// dropping the schema. Delete order respects foreign keys (children first).
export async function resetScenario() {
  await PlanAction.destroy({ where: {}, force: true })
  await DecisionLog.destroy({ where: {}, force: true })
  await ResponsePlan.destroy({ where: {}, force: true })
  await Incident.destroy({ where: {}, force: true })
  await SimulationEvent.destroy({ where: {}, force: true })
  await Alert.destroy({ where: {}, force: true })
  await CommunityKitchen.destroy({ where: {}, force: true })
  await ReliefCamp.destroy({ where: {}, force: true })
  await MedicalUnit.destroy({ where: {}, force: true })
  await Resource.destroy({ where: {}, force: true })
  await ResponseTeam.destroy({ where: {}, force: true })
  await Road.destroy({ where: {}, force: true })
  await District.destroy({ where: {}, force: true })
  await SimulationState.destroy({ where: {}, force: true })

  await seedScenarioData()

  return SimulationState.findOne()
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
