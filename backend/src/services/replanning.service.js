import { Op } from 'sequelize'
import Road from '../models/Road.js'
import ResponseTeam from '../models/ResponseTeam.js'
import Hospital from '../models/Hospital.js'
import Shelter from '../models/Shelter.js'
import Resource from '../models/Resource.js'
import Incident from '../models/Incident.js'
import ResponsePlan from '../models/ResponsePlan.js'
import PlanAction from '../models/PlanAction.js'
import DecisionLog from '../models/DecisionLog.js'
import { findShortestRoute } from './routeEngine.service.js'
import { nextPlanNumber, nextDecisionNumber } from './counters.service.js'
import { emitEvent } from '../socket/index.js'
import { explainDecision } from '../ai/ai.service.js'

const ZONE_NAMES = {
  ZoneA: 'Zone A — Patliputra',
  ZoneB: 'Zone B — Kankarbagh',
  ZoneC: 'Zone C — Digha',
  ZoneD: 'Zone D — Rajendra Nagar',
  ZoneE: 'Zone E — Danapur',
}

const PLAN_INCLUDE = [
  { association: 'incident' },
  { association: 'actions', include: ['team', 'hospital', 'shelter'] },
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

async function findBestHospital(excludeId) {
  return Hospital.findOne({ where: { status: { [Op.ne]: 'CRITICAL' }, id: { [Op.ne]: excludeId } }, order: [['currentLoadPct', 'ASC']] })
}

async function findBestShelter(excludeId) {
  const shelters = await Shelter.findAll({ where: { status: { [Op.ne]: 'FULL' }, id: { [Op.ne]: excludeId } } })
  return shelters
    .map((s) => ({ s, free: s.capacity - s.occupied }))
    .sort((a, b) => b.free - a.free)[0]?.s || null
}

async function buildPlanFromTeamRoute({ team, incident, trigger, previousPlanId }) {
  const targetZone = team.currentAssignment.zone
  const route = await findShortestRoute(team.location, targetZone)

  if (!route) {
    return {
      failed: true,
      reason: `No available route from ${team.location} to ${targetZone}. All roads impassable.`,
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
          toNode: targetZone,
          route: route.route,
          roadsUsed: route.roadsUsed,
          etaMin: route.etaMin,
          description: `${team.name} dispatched to ${ZONE_NAMES[targetZone] || targetZone} via ${route.roadsUsed.join(' → ')}`,
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
  const hospital = await Hospital.findByPk(hospitalId)
  if (!hospital) return { error: 'Hospital not found.' }

  hospital.currentLoadPct = Math.max(hospital.currentLoadPct, 96)
  hospital.availableBeds = Math.max(0, Math.round(hospital.totalBeds * 0.02))
  hospital.status = 'CRITICAL'
  await hospital.save()
  emitEvent('hospital:updated', { hospital: hospital.toJSON() })

  const alternate = await findBestHospital(hospital.id)
  const plans = await ResponsePlan.findAll({ where: { status: 'ACTIVE' }, include: [{ association: 'actions' }] })
  const affectedPlans = plans.filter((p) => p.actions.some((a) => a.hospitalId === hospital.id))

  const results = []
  for (const plan of affectedPlans) {
    plan.status = 'INVALIDATED'
    await plan.save()
    emitEvent('plan:invalidated', { planId: plan.id, planNumber: plan.planNumber, reason: `Hospital ${hospital.name} overloaded` })

    if (!alternate) continue

    const planNumber = await nextPlanNumber()
    const created = await ResponsePlan.create(
      {
        planNumber,
        status: 'ACTIVE',
        trigger: `Hospital ${hospital.name} reached critical capacity`,
        previousPlanId: plan.id,
        actions: [
          {
            type: 'AMBULANCE_TRANSPORT',
            hospitalId: alternate.id,
            description: `Patients redirected to ${alternate.name} (${alternate.currentLoadPct}% load).`,
          },
        ],
        affectedResources: [hospital.name, alternate.name],
        estimatedImpact: `Redirect to ${alternate.name}`,
        reasoning: `${hospital.name} exceeded safe capacity threshold.`,
      },
      { include: [{ association: 'actions' }] }
    )
    const newPlan = await loadFullPlan(created.id)
    emitEvent('plan:created', { plan: newPlan.toJSON() })
    emitEvent('plan:activated', { planId: newPlan.id, planNumber: newPlan.planNumber })

    const decision = await createDecisionLog({
      trigger: `Hospital ${hospital.name} overloaded`,
      agents: ['Resource Agent', 'Risk Agent', 'Planning Agent'],
      decision: `Redirect new patients to ${alternate.name}.`,
      reason: `${hospital.name} reached ${hospital.currentLoadPct}% capacity, exceeding the safe threshold.`,
      result: `Incoming patients now routed to ${alternate.name} (${alternate.currentLoadPct}% load).`,
      relatedPlanId: newPlan.id,
    })
    results.push({ plan: newPlan, decision })
  }

  if (!alternate) {
    await createDecisionLog({
      trigger: `Hospital ${hospital.name} overloaded`,
      agents: ['Resource Agent', 'Risk Agent'],
      decision: 'No alternate hospital available with spare capacity.',
      reason: 'All monitored hospitals are at or near capacity.',
      result: 'Escalation required — consider field triage.',
      status: 'PENDING',
    })
  }

  return { hospital, alternate, results }
}

async function handleShelterFull({ shelterId }) {
  const shelter = await Shelter.findByPk(shelterId)
  if (!shelter) return { error: 'Shelter not found.' }

  shelter.occupied = shelter.capacity
  shelter.status = 'FULL'
  await shelter.save()
  emitEvent('shelter:updated', { shelter: shelter.toJSON() })

  const alternate = await findBestShelter(shelter.id)
  const plans = await ResponsePlan.findAll({ where: { status: 'ACTIVE' }, include: [{ association: 'actions' }] })
  const affectedPlans = plans.filter((p) => p.actions.some((a) => a.shelterId === shelter.id))

  const results = []
  for (const plan of affectedPlans) {
    plan.status = 'INVALIDATED'
    await plan.save()
    emitEvent('plan:invalidated', { planId: plan.id, planNumber: plan.planNumber, reason: `Shelter ${shelter.name} full` })

    if (!alternate) continue

    const planNumber = await nextPlanNumber()
    const created = await ResponsePlan.create(
      {
        planNumber,
        status: 'ACTIVE',
        trigger: `Shelter ${shelter.name} reached full capacity`,
        previousPlanId: plan.id,
        actions: [
          {
            type: 'EVACUATION',
            shelterId: alternate.id,
            description: `Evacuation destination changed to ${alternate.name}.`,
          },
        ],
        affectedResources: [shelter.name, alternate.name],
        estimatedImpact: `Redirect evacuees to ${alternate.name}`,
        reasoning: `${shelter.name} is full.`,
      },
      { include: [{ association: 'actions' }] }
    )
    const newPlan = await loadFullPlan(created.id)
    emitEvent('plan:created', { plan: newPlan.toJSON() })
    emitEvent('plan:activated', { planId: newPlan.id, planNumber: newPlan.planNumber })

    const decision = await createDecisionLog({
      trigger: `Shelter ${shelter.name} full`,
      agents: ['Resource Agent', 'Planning Agent'],
      decision: `Redirect evacuation to ${alternate.name}.`,
      reason: `${shelter.name} reached full occupancy (${shelter.capacity}/${shelter.capacity}).`,
      result: `Evacuees now routed to ${alternate.name} (${alternate.capacity - alternate.occupied} spaces available).`,
      relatedPlanId: newPlan.id,
    })
    results.push({ plan: newPlan, decision })
  }

  return { shelter, alternate, results }
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
    const toNode = plan.actions[0]?.toNode || alternate.currentAssignment.zone
    alternate.currentAssignment = { ...alternate.currentAssignment, zone: toNode }
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
  const roads = await Road.findAll({ where: { [Op.or]: [{ from: zone }, { to: zone }] } })
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
    trigger: `Flood levels rising near ${ZONE_NAMES[zone] || zone}`,
    agents: ['Situation Agent', 'Risk Agent'],
    decision: `Elevated risk rating on ${updated.length} connecting road${updated.length === 1 ? '' : 's'}.`,
    reason: 'Rising water levels increase transit risk and reduce safe travel speed.',
    result: updated.map((r) => `${r.roadId}: ${r.status}`).join(', ') || 'No connected roads found.',
  })

  emitEvent('alert:created', {
    severity: 'warning',
    message: `Flood rising near ${ZONE_NAMES[zone] || zone}. ${updated.length} road(s) re-rated.`,
  })

  return { updated, decision }
}

async function handleSupplyShortage({ resourceId }) {
  const resource = await Resource.findByPk(resourceId)
  if (!resource) return { error: 'Resource not found.' }

  resource.available = Math.max(0, Math.round(resource.available * 0.35))
  resource.status = resource.available / resource.total < 0.15 ? 'CRITICAL' : 'LOW'
  await resource.save()
  emitEvent('resource:updated', { resource: resource.toJSON() })

  const decision = await createDecisionLog({
    trigger: `Supply shortage: ${resource.name}`,
    agents: ['Resource Agent'],
    decision: `${resource.name} marked ${resource.status}.`,
    reason: `Available stock dropped to ${resource.available}/${resource.total} ${resource.unit}.`,
    result: 'Resupply request flagged for command review.',
    status: 'PENDING',
  })

  emitEvent('alert:created', {
    severity: resource.status === 'CRITICAL' ? 'critical' : 'warning',
    message: `${resource.name} supply is ${resource.status.toLowerCase()} (${resource.available}/${resource.total} ${resource.unit}).`,
  })

  return { resource, decision }
}

const INCIDENT_TEMPLATES = [
  { type: 'WATER_RESCUE', description: 'Family stranded on rooftop as water levels rise.', resources: ['Boats', 'Rescue Teams'] },
  { type: 'MEDICAL_EMERGENCY', description: 'Multiple residents reporting waterborne illness symptoms.', resources: ['Medical Kits', 'Ambulances'] },
  { type: 'INFRASTRUCTURE', description: 'Embankment showing signs of structural weakening.', resources: ['Rescue Teams', 'Equipment'] },
]

async function handleNewIncident() {
  const zones = ['ZoneA', 'ZoneB', 'ZoneC', 'ZoneD', 'ZoneE']
  const template = INCIDENT_TEMPLATES[Math.floor(Math.random() * INCIDENT_TEMPLATES.length)]
  const zone = zones[Math.floor(Math.random() * zones.length)]
  const count = await Incident.count()

  const incident = await Incident.create({
    incidentId: `INC-${String(count + 1).padStart(4, '0')}`,
    type: template.type,
    severity: Math.random() > 0.6 ? 'HIGH' : 'MEDIUM',
    status: 'ACTIVE',
    zone,
    description: template.description,
    affectedPopulation: Math.floor(Math.random() * 400) + 20,
    requiredResources: template.resources,
  })
  emitEvent('incident:created', { incident: incident.toJSON() })

  const team = await ResponseTeam.findOne({ where: { status: 'AVAILABLE' } })
  let planResult = null
  if (team) {
    team.currentAssignment = { ...team.currentAssignment, zone }
    planResult = await buildPlanFromTeamRoute({ team, incident, trigger: `New incident ${incident.incidentId} reported` })
    if (!planResult.failed) {
      incident.assignedTeamId = team.id
      await incident.save()
    }
  }

  const decision = await createDecisionLog({
    trigger: `New incident reported: ${incident.incidentId}`,
    agents: ['Situation Agent', 'Planning Agent'],
    decision: team ? `${team.name} dispatched to ${incident.zone}.` : 'No team currently available for dispatch.',
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
