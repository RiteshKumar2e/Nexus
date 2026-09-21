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
  DecisionLog,
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

export async function seedDatabase() {
  // Drop and recreate every table for a clean, fully deterministic scenario reset.
  await syncModels({ force: true })

  await Promise.all([
    User.create({ name: 'Commander Rao', email: 'commander@nexus.io', password: 'password123', role: 'COMMANDER' }),
    User.create({ name: 'Operator Mehta', email: 'operator@nexus.io', password: 'password123', role: 'OPERATOR' }),
    User.create({ name: 'Observer Singh', email: 'viewer@nexus.io', password: 'password123', role: 'VIEWER' }),
  ])

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
