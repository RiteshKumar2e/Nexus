import expressAsyncHandler from 'express-async-handler'
import SimulationState from '../models/SimulationState.js'
import SimulationEvent from '../models/SimulationEvent.js'
import ApiError from '../utils/ApiError.js'
import { emitEvent } from '../socket/index.js'
import { recalculateResponsePlan } from '../services/replanning.service.js'
import { resolveEventPayload } from '../simulation/engine.js'
import { resetScenario } from '../seed/seed.js'

const EVENT_LABELS = {
  ROAD_BLOCKED: 'Road blocked',
  HOSPITAL_OVERLOAD: 'Medical unit at critical capacity',
  SHELTER_FULL: 'Relief camp full',
  TEAM_UNAVAILABLE: 'Team unavailable',
  FLOOD_RISING: 'Flood rising',
  SUPPLY_SHORTAGE: 'Supply shortage',
  NEW_INCIDENT: 'New incident',
}

async function getOrCreateState() {
  let state = await SimulationState.findOne()
  if (!state) state = await SimulationState.create({})
  return state
}

export const getState = expressAsyncHandler(async (req, res) => {
  const state = await getOrCreateState()
  res.json({ state })
})

export const startSimulation = expressAsyncHandler(async (req, res) => {
  const state = await getOrCreateState()
  state.status = 'RUNNING'
  state.startedAt = state.startedAt || new Date()
  await state.save()
  emitEvent('simulation:state', { state: state.toJSON() })
  res.json({ state })
})

export const pauseSimulation = expressAsyncHandler(async (req, res) => {
  const state = await getOrCreateState()
  state.status = 'PAUSED'
  await state.save()
  emitEvent('simulation:state', { state: state.toJSON() })
  res.json({ state })
})

export const resumeSimulation = expressAsyncHandler(async (req, res) => {
  const state = await getOrCreateState()
  state.status = 'RUNNING'
  await state.save()
  emitEvent('simulation:state', { state: state.toJSON() })
  res.json({ state })
})

export const resetSimulation = expressAsyncHandler(async (req, res) => {
  const state = await resetScenario()
  emitEvent('simulation:reset', {})
  res.json({ state, message: 'Simulation reset to initial scenario state.' })
})

export const triggerEvent = expressAsyncHandler(async (req, res) => {
  const { type, payload = {} } = req.body
  if (!type || !EVENT_LABELS[type]) throw new ApiError(400, `Unsupported event type: ${type}`)

  const resolvedPayload = await resolveEventPayload(type, payload)

  const event = await SimulationEvent.create({
    type,
    payload: resolvedPayload,
    description: `${EVENT_LABELS[type]} triggered by ${req.user.name}`,
  })
  emitEvent('simulation:event', { event: event.toJSON() })

  const result = await recalculateResponsePlan({ type, payload: resolvedPayload })

  res.json({ event, result })
})
