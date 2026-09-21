import { Op } from 'sequelize'
import Road from '../models/Road.js'
import ResponseTeam from '../models/ResponseTeam.js'
import MedicalUnit from '../models/MedicalUnit.js'
import ReliefCamp from '../models/ReliefCamp.js'
import Resource from '../models/Resource.js'
import Incident from '../models/Incident.js'
import Alert from '../models/Alert.js'
import ResponsePlan from '../models/ResponsePlan.js'
import PlanAction from '../models/PlanAction.js'
import DecisionLog from '../models/DecisionLog.js'
import { findShortestRoute } from './routeEngine.service.js'
import { nextPlanNumber, nextDecisionNumber } from './counters.service.js'
import { emitEvent } from '../socket/index.js'
import { explainDecision } from '../ai/ai.service.js'
import { ZONES } from '../config/zones.js'

const DISTRICT_NAMES = Object.fromEntries(ZONES.map((z) => [z.id, z.name]))
const DISTRICT_IDS = ZONES.filter((z) => z.type === 'district').map((z) => z.id)

// Ordered best-to-worst so "pick the least-bad alternative" is a simple sort.
const MEDICAL_STATUS_RANK = { AVAILABLE: 0, LIMITED: 1, HIGH_DEMAND: 2, CRITICAL: 3 }
const CAMP_STATUS_RANK = { AVAILABLE: 0, NEAR_CAPACITY: 1, FULL: 2 }

const PLAN_INCLUDE = [
  { association: 'incident' },
  { association: 'actions', include: ['team', 'medicalUnit', 'reliefCamp'] },
]

async function loadFullPlan(id) {
  return ResponsePlan.findByPk(id, { include: PLAN_INCLUDE })
}

async function createDecisionLog({ trigger, agents, decision, reason, result, relatedPlanId, status = 'EXECUTED' }) {
  const decisionNumber = await nextDecisionNumber()
  const log = await DecisionLog.create({
    decisionNumber,
    trigger,
    agents,
    decision,
    reason,
    result,
    status,
    relatedPlanId: relatedPlanId || null,
  })

  // Fire-and-forget AI narrative explanation; never blocks the deterministic
  // decision from being recorded or emitted.
  explainDecision(log.toJSON())
    .then((explanation) => {
      if (explanation) {
        DecisionLog.update({ aiExplanation: explanation }, { where: { id: log.id } })
        emitEvent('decision:explained', { decisionId: log.id, explanation })
      }
    })
    .catch(() => {})

  emitEvent('decision:created', { decision: log.toJSON() })
  return log
}

async function createAlert({ severity, message, district = null, title = 'Simulation alert' }) {
  const alert = await Alert.create({ title, message, severity, district, sourceType: 'SIMULATED', source: 'Response Simulation' })
  emitEvent('alert:created', { alert: alert.toJSON() })
  return alert
}

async function invalidatePlansUsingRoad(roadId) {
  const activePlans = await ResponsePlan.findAll({ where: { status: 'ACTIVE' }, include: [{ association: 'actions' }] })
  const affected = activePlans.filter((plan) => plan.actions.some((a) => (a.roadsUsed || []).includes(roadId)))

  for (const plan of affected) {
    plan.status = 'INVALIDATED'
    await plan.save()
    emitEvent('plan:invalidated', { planId: plan.id, planNumber: plan.planNumber, reason: `Road ${roadId} blocked` })
  }
  return affected
}

async function findAlternateTeam(type, excludeId) {
  return ResponseTeam.findOne({ where: { type, status: 'AVAILABLE', id: { [Op.ne]: excludeId } } })
}

async function findBestMedicalUnit(excludeId) {
  const units = await MedicalUnit.findAll({ where: { status: { [Op.ne]: 'CRITICAL' }, id: { [Op.ne]: excludeId } } })
  return units.sort((a, b) => (MEDICAL_STATUS_RANK[a.status] ?? 9) - (MEDICAL_STATUS_RANK[b.status] ?? 9))[0] || null
}

async function findBestReliefCamp(excludeId) {
  const camps = await ReliefCamp.findAll({ where: { capacityStatus: { [Op.ne]: 'FULL' }, id: { [Op.ne]: excludeId } } })
  return camps.sort((a, b) => (CAMP_STATUS_RANK[a.capacityStatus] ?? 9) - (CAMP_STATUS_RANK[b.capacityStatus] ?? 9))[0] || null
}

async function buildPlanFromTeamRoute({ team, incident, trigger, previousPlanId }) {
  const targetDistrict = team.currentAssignment.district
  const route = await findShortestRoute(team.location, targetDistrict)

  if (!route) {
    return {
      failed: true,
      reason: `No available route from ${team.location} to ${targetDistrict}. All roads impassable.`,
    }
  }

  team.currentAssignment = { ...team.currentAssignment, route: route.route, roadsUsed: route.roadsUsed, eta: route.etaMin }
  team.status = 'EN_ROUTE'
  await team.save()
  emitEvent('team:updated', { team: team.toJSON() })

  const planNumber = await nextPlanNumber()
  const created = await ResponsePlan.create(
    {
      planNumber,
      status: 'ACTIVE',
      trigger,
      incidentId: incident?.id || null,
      previousPlanId: previousPlanId || null,
      actions: [
        {
          type: 'TEAM_DISPATCH',
          teamId: team.id,
          fromNode: team.location,
          toNode: targetDistrict,
          route: route.route,
          roadsUsed: route.roadsUsed,
          etaMin: route.etaMin,
          description: `${team.name} dispatched to ${DISTRICT_NAMES[targetDistrict] || targetDistrict} via ${route.roadsUsed.join(' → ')}`,
        },
      ],
      affectedResources: [team.name],
      estimatedImpact: `ETA ${route.etaMin} min · ${route.distanceKm} km`,
      reasoning: trigger,
    },
    { include: [{ association: 'actions' }] }
  )

  const plan = await loadFullPlan(created.id)
  emitEvent('plan:created', { plan: plan.toJSON() })
  emitEvent('plan:activated', { planId: plan.id, planNumber: plan.planNumber })

  return { plan, route }
}

async function handleRoadBlocked({ roadId }) {
  const road = await Road.findOne({ where: { roadId } })
  if (!road) return { error: `Road ${roadId} not found.` }

  const previousStatus = road.status
  road.status = 'BLOCKED'
  await road.save()
  emitEvent('road:blocked', { road: road.toJSON() })

  const invalidatedPlans = await invalidatePlansUsingRoad(roadId)

  const results = []
  for (const oldPlan of invalidatedPlans) {
    const teamAction = oldPlan.actions.find((a) => a.teamId)
    if (!teamAction) continue
    const team = await ResponseTeam.findByPk(teamAction.teamId)
    if (!team) continue

    const oldEta = teamAction.etaMin
    const outcome = await buildPlanFromTeamRoute({
      team,
      incident: oldPlan.incidentId ? { id: oldPlan.incidentId } : null,
      trigger: `Road ${roadId} became blocked`,
      previousPlanId: oldPlan.id,
    })

    if (outcome.failed) {
      await createDecisionLog({
        trigger: `Road ${roadId} blocked`,
        agents: ['Situation Agent', 'Risk Agent', 'Route Agent'],
        decision: `${team.name} could not be rerouted.`,
        reason: outcome.reason,
        result: 'No viable alternative route found. Escalation required.',
        status: 'PENDING',
      })
      continue
    }

    const decision = await createDecisionLog({
      trigger: `Road ${roadId} blocked`,
      agents: ['Situation Agent', 'Risk Agent', 'Route Agent', 'Planning Agent', 'Replanning Agent'],
      decision: `Reassign ${team.name} via alternate route ${outcome.route.roadsUsed.join(' → ')}.`,
      reason: `Original route unavailable. Road ${roadId} is now BLOCKED (was ${previousStatus}).`,
      result: `ETA changed: ${oldEta} min → ${outcome.route.etaMin} min`,
      relatedPlanId: outcome.plan.id,
    })

    results.push({ plan: outcome.plan, decision, team })
  }

  return { road, invalidatedPlans, results }
}

async function handleHospitalOverload({ hospitalId }) {
  const medicalUnit = await MedicalUnit.findByPk(hospitalId)
  if (!medicalUnit) return { error: 'Medical unit not found.' }

  medicalUnit.status = 'CRITICAL'
  medicalUnit.doctorsStatus = 'CRITICAL'
  medicalUnit.ambulanceStatus = 'HIGH_DEMAND'
  medicalUnit.priorityCases = 'CRITICAL'
  await medicalUnit.save()
  emitEvent('medicalUnit:updated', { medicalUnit: medicalUnit.toJSON() })

  const alternate = await findBestMedicalUnit(medicalUnit.id)
  const plans = await ResponsePlan.findAll({ where: { status: 'ACTIVE' }, include: [{ association: 'actions' }] })
  const affectedPlans = plans.filter((p) => p.actions.some((a) => a.medicalUnitId === medicalUnit.id))

  const results = []
  for (const plan of affectedPlans) {
    plan.status = 'INVALIDATED'
    await plan.save()
    emitEvent('plan:invalidated', { planId: plan.id, planNumber: plan.planNumber, reason: `Medical unit ${medicalUnit.name} at critical capacity` })

    if (!alternate) continue

    const planNumber = await nextPlanNumber()
    const created = await ResponsePlan.create(
      {
        planNumber,
        status: 'ACTIVE',
        trigger: `Medical unit ${medicalUnit.name} reached critical status`,
        previousPlanId: plan.id,
        actions: [
          {
            type: 'AMBULANCE_TRANSPORT',
            medicalUnitId: alternate.id,
            description: `Patients redirected to ${alternate.name} (status: ${alternate.status}).`,
          },
        ],
        affectedResources: [medicalUnit.name, alternate.name],
        estimatedImpact: `Redirect to ${alternate.name}`,
        reasoning: `${medicalUnit.name} exceeded safe operating capacity.`,
      },
      { include: [{ association: 'actions' }] }
    )
    const newPlan = await loadFullPlan(created.id)
    emitEvent('plan:created', { plan: newPlan.toJSON() })
    emitEvent('plan:activated', { planId: newPlan.id, planNumber: newPlan.planNumber })

    const decision = await createDecisionLog({
      trigger: `Medical unit ${medicalUnit.name} overloaded`,
      agents: ['Resource Agent', 'Risk Agent', 'Planning Agent'],
      decision: `Redirect new patients to ${alternate.name}.`,
      reason: `${medicalUnit.name} reached critical status, exceeding safe operating capacity.`,
      result: `Incoming patients now routed to ${alternate.name} (status: ${alternate.status}).`,
      relatedPlanId: newPlan.id,
    })
    results.push({ plan: newPlan, decision })
  }

  if (!alternate) {
    await createDecisionLog({
      trigger: `Medical unit ${medicalUnit.name} overloaded`,
      agents: ['Resource Agent', 'Risk Agent'],
      decision: 'No alternate medical unit available with spare capacity.',
      reason: 'All monitored medical units are at or near critical status.',
      result: 'Escalation required — consider field triage.',
      status: 'PENDING',
    })
  }

  return { hospital: medicalUnit, alternate, results }
}

async function handleShelterFull({ shelterId }) {
  const reliefCamp = await ReliefCamp.findByPk(shelterId)
  if (!reliefCamp) return { error: 'Relief camp not found.' }

  reliefCamp.capacityStatus = 'FULL'
  await reliefCamp.save()
  emitEvent('reliefCamp:updated', { reliefCamp: reliefCamp.toJSON() })

  const alternate = await findBestReliefCamp(reliefCamp.id)
  const plans = await ResponsePlan.findAll({ where: { status: 'ACTIVE' }, include: [{ association: 'actions' }] })
  const affectedPlans = plans.filter((p) => p.actions.some((a) => a.reliefCampId === reliefCamp.id))

  const results = []
  for (const plan of affectedPlans) {
    plan.status = 'INVALIDATED'
    await plan.save()
    emitEvent('plan:invalidated', { planId: plan.id, planNumber: plan.planNumber, reason: `Relief camp ${reliefCamp.name} full` })

    if (!alternate) continue

    const planNumber = await nextPlanNumber()
    const created = await ResponsePlan.create(
      {
        planNumber,
        status: 'ACTIVE',
        trigger: `Relief camp ${reliefCamp.name} reached full capacity`,
        previousPlanId: plan.id,
        actions: [
          {
            type: 'EVACUATION',
            reliefCampId: alternate.id,
            description: `Evacuation destination changed to ${alternate.name}.`,
          },
        ],
        affectedResources: [reliefCamp.name, alternate.name],
        estimatedImpact: `Redirect evacuees to ${alternate.name}`,
        reasoning: `${reliefCamp.name} is full.`,
      },
      { include: [{ association: 'actions' }] }
    )
    const newPlan = await loadFullPlan(created.id)
    emitEvent('plan:created', { plan: newPlan.toJSON() })
    emitEvent('plan:activated', { planId: newPlan.id, planNumber: newPlan.planNumber })

    const decision = await createDecisionLog({
      trigger: `Relief camp ${reliefCamp.name} full`,
      agents: ['Resource Agent', 'Planning Agent'],
      decision: `Redirect evacuation to ${alternate.name}.`,
      reason: `${reliefCamp.name} reached full capacity.`,
      result: `Evacuees now routed to ${alternate.name} (capacity status: ${alternate.capacityStatus}).`,
      relatedPlanId: newPlan.id,
    })
    results.push({ plan: newPlan, decision })
  }

  return { shelter: reliefCamp, alternate, results }
}

async function handleTeamUnavailable({ teamId }) {
  const team = await ResponseTeam.findByPk(teamId)
  if (!team) return { error: 'Team not found.' }

  team.status = 'UNAVAILABLE'
  await team.save()
  emitEvent('team:updated', { team: team.toJSON() })

  const alternate = await findAlternateTeam(team.type, team.id)
  const plans = await ResponsePlan.findAll({ where: { status: 'ACTIVE' }, include: [{ association: 'actions' }] })
  const affectedPlans = plans.filter((p) => p.actions.some((a) => a.teamId === team.id))

  const results = []
  for (const plan of affectedPlans) {
    plan.status = 'INVALIDATED'
    await plan.save()
    emitEvent('plan:invalidated', { planId: plan.id, planNumber: plan.planNumber, reason: `${team.name} unavailable` })

    if (!alternate) continue
    const toNode = plan.actions[0]?.toNode || alternate.currentAssignment.district
    alternate.currentAssignment = { ...alternate.currentAssignment, district: toNode }
    const outcome = await buildPlanFromTeamRoute({
      team: alternate,
      incident: plan.incidentId ? { id: plan.incidentId } : null,
      trigger: `${team.name} became unavailable`,
      previousPlanId: plan.id,
    })
    if (outcome.failed) continue

    const decision = await createDecisionLog({
      trigger: `${team.name} unavailable`,
      agents: ['Resource Agent', 'Route Agent', 'Planning Agent'],
      decision: `${alternate.name} assigned in place of ${team.name}.`,
      reason: `${team.name} reported unavailable mid-response.`,
      result: `New ETA: ${outcome.route.etaMin} min via ${outcome.route.roadsUsed.join(' → ')}`,
      relatedPlanId: outcome.plan.id,
    })
    results.push({ plan: outcome.plan, decision })
  }

  return { team, alternate, results }
}

async function handleFloodRising({ zone }) {
  const district = zone
  const roads = await Road.findAll({ where: { [Op.or]: [{ from: district }, { to: district }] } })
  const updated = []
  for (const road of roads) {
    if (road.status === 'OPEN') road.status = 'CONGESTED'
    else if (road.status === 'CONGESTED') road.status = 'DANGEROUS'
    road.risk = Math.min(5, road.risk + 1)
    await road.save()
    emitEvent('road:updated', { road: road.toJSON() })
    updated.push(road)
  }

  const decision = await createDecisionLog({
    trigger: `Flood levels rising near ${DISTRICT_NAMES[district] || district}`,
    agents: ['Situation Agent', 'Risk Agent'],
    decision: `Elevated risk rating on ${updated.length} connecting road${updated.length === 1 ? '' : 's'}.`,
    reason: 'Rising water levels increase transit risk and reduce safe travel speed.',
    result: updated.map((r) => `${r.roadId}: ${r.status}`).join(', ') || 'No connected roads found.',
  })

  await createAlert({
    title: `Flood rising — ${DISTRICT_NAMES[district] || district}`,
    severity: 'HIGH',
    district,
    message: `Flood levels rising near ${DISTRICT_NAMES[district] || district}. ${updated.length} road(s) re-rated.`,
  })

  return { updated, decision }
}

async function handleSupplyShortage({ resourceId }) {
  const resource = await Resource.findByPk(resourceId)
  if (!resource) return { error: 'Resource not found.' }

  resource.available = Math.max(0, Math.round(resource.available * 0.35))
  resource.status = 'CRITICAL_SHORTAGE'
  await resource.save()
  emitEvent('resource:updated', { resource: resource.toJSON() })

  const decision = await createDecisionLog({
    trigger: `Supply shortage: ${resource.name}${resource.region ? ` (${DISTRICT_NAMES[resource.region] || resource.region})` : ''}`,
    agents: ['Resource Agent'],
    decision: `${resource.name} marked CRITICAL SHORTAGE.`,
    reason: `Available stock dropped sharply against required deployment levels.`,
    result: 'Resupply request flagged for command review.',
    status: 'PENDING',
  })

  await createAlert({
    title: `Supply shortage — ${resource.name}`,
    severity: 'CRITICAL',
    district: resource.region || null,
    message: `${resource.name} supply is at critical shortage${resource.region ? ` in ${DISTRICT_NAMES[resource.region] || resource.region}` : ''}.`,
  })

  return { resource, decision }
}

// Bihar flood-relevant templates for the "simulate new incident" demo button.
// This stays a live, clearly-labeled simulation feature (see SimulationPage),
// not a static data fixture — but the pool is scenario-appropriate rather
// than generic, and no numeric population figure is invented (a qualitative
// impact level is picked instead).
const INCIDENT_TEMPLATES = [
  { type: 'WATER_RESCUE', description: 'Family stranded on rooftop as water levels rise.', resources: ['Rescue Boats', 'Rescue Teams'] },
  { type: 'MEDICAL_EMERGENCY', description: 'Multiple residents reporting waterborne illness symptoms.', resources: ['Medical Kits', 'Ambulances'] },
  { type: 'INFRASTRUCTURE', description: 'Embankment showing signs of structural weakening.', resources: ['Rescue Teams', 'Equipment'] },
  { type: 'FLOOD', description: 'Sudden waterlogging cutting off a residential block.', resources: ['Rescue Boats', 'Drinking Water'] },
  { type: 'MEDICAL_EMERGENCY', description: 'Elderly residents requiring evacuation for ongoing medical treatment.', resources: ['Ambulances'] },
]
const POPULATION_IMPACTS = ['LOCALIZED', 'MODERATE', 'LARGE']

async function handleNewIncident() {
  const template = INCIDENT_TEMPLATES[Math.floor(Math.random() * INCIDENT_TEMPLATES.length)]
  const district = DISTRICT_IDS[Math.floor(Math.random() * DISTRICT_IDS.length)]
  const count = await Incident.count()

  const incident = await Incident.create({
    incidentId: `INC-${String(count + 1).padStart(4, '0')}`,
    type: template.type,
    severity: Math.random() > 0.6 ? 'HIGH' : 'MEDIUM',
    status: 'ACTIVE',
    district,
    description: template.description,
    populationImpact: POPULATION_IMPACTS[Math.floor(Math.random() * POPULATION_IMPACTS.length)],
    requiredResources: template.resources,
  })
  emitEvent('incident:created', { incident: incident.toJSON() })

  const team = await ResponseTeam.findOne({ where: { status: 'AVAILABLE' } })
  let planResult = null
  if (team) {
    team.currentAssignment = { ...team.currentAssignment, district }
    planResult = await buildPlanFromTeamRoute({ team, incident, trigger: `New incident ${incident.incidentId} reported` })
    if (!planResult.failed) {
      incident.assignedTeamId = team.id
      await incident.save()
    }
  }

  const decision = await createDecisionLog({
    trigger: `New incident reported: ${incident.incidentId}`,
    agents: ['Situation Agent', 'Planning Agent'],
    decision: team ? `${team.name} dispatched to ${DISTRICT_NAMES[incident.district] || incident.district}.` : 'No team currently available for dispatch.',
    reason: incident.description,
    result: team ? `ETA ${planResult?.route?.etaMin ?? '—'} min` : 'Incident queued for the next available team.',
    status: team ? 'EXECUTED' : 'PENDING',
    relatedPlanId: planResult?.plan?.id,
  })

  return { incident, team, decision }
}

/**
 * Central deterministic replanning entry point. AI is used only downstream,
 * to explain a decision after it has already been computed — never to decide
 * the state transition itself.
 */
export async function recalculateResponsePlan(event) {
  switch (event.type) {
    case 'ROAD_BLOCKED':
      return handleRoadBlocked(event.payload)
    case 'HOSPITAL_OVERLOAD':
      return handleHospitalOverload(event.payload)
    case 'SHELTER_FULL':
      return handleShelterFull(event.payload)
    case 'TEAM_UNAVAILABLE':
      return handleTeamUnavailable(event.payload)
    case 'FLOOD_RISING':
      return handleFloodRising(event.payload)
    case 'SUPPLY_SHORTAGE':
      return handleSupplyShortage(event.payload)
    case 'NEW_INCIDENT':
      return handleNewIncident()
    default:
      return { error: `Unknown event type: ${event.type}` }
  }
}
