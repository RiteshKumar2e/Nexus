import { Op, fn, col } from 'sequelize'
import Road from '../models/Road.js'
import Hospital from '../models/Hospital.js'
import Shelter from '../models/Shelter.js'
import ResponseTeam from '../models/ResponseTeam.js'
import Resource from '../models/Resource.js'
import Incident from '../models/Incident.js'

/**
 * Resolves a sensible default target for a simulation event button when the
 * operator doesn't pick a specific entity — e.g. "Trigger Road Block" always
 * blocks the busiest still-open road, defaulting to R1 to match the primary
 * demo narrative (Road R1 blocked → Team Alpha rerouted).
 */
export async function resolveEventPayload(type, payload = {}) {
  switch (type) {
    case 'ROAD_BLOCKED': {
      if (payload.roadId) return payload
      const preferred = await Road.findOne({ where: { roadId: 'R1', status: { [Op.ne]: 'BLOCKED' } } })
      if (preferred) return { roadId: preferred.roadId }
      const fallback = await Road.findOne({ where: { status: { [Op.ne]: 'BLOCKED' } } })
      return { roadId: fallback?.roadId }
    }
    case 'HOSPITAL_OVERLOAD': {
      if (payload.hospitalId) return payload
      const preferred = await Hospital.findOne({ where: { name: { [Op.like]: '%H2%' }, status: { [Op.ne]: 'CRITICAL' } } })
      if (preferred) return { hospitalId: preferred.id }
      const fallback = await Hospital.findOne({ where: { status: { [Op.ne]: 'CRITICAL' } }, order: [['currentLoadPct', 'DESC']] })
      return { hospitalId: fallback?.id }
    }
    case 'SHELTER_FULL': {
      if (payload.shelterId) return payload
      const preferred = await Shelter.findOne({ where: { name: { [Op.like]: '%S2%' }, status: { [Op.ne]: 'FULL' } } })
      if (preferred) return { shelterId: preferred.id }
      const shelters = await Shelter.findAll({ where: { status: { [Op.ne]: 'FULL' } } })
      const best = shelters.sort((a, b) => b.occupied / b.capacity - a.occupied / a.capacity)[0]
      return { shelterId: best?.id }
    }
    case 'TEAM_UNAVAILABLE': {
      if (payload.teamId) return payload
      const preferred = await ResponseTeam.findOne({
        where: { status: { [Op.in]: ['EN_ROUTE', 'BUSY', 'AVAILABLE'] } },
        order: [['updatedAt', 'DESC']],
      })
      return { teamId: preferred?.id }
    }
    case 'FLOOD_RISING': {
      if (payload.zone) return payload
      const grouped = await Incident.findAll({
        where: { status: { [Op.ne]: 'RESOLVED' } },
        attributes: ['zone', [fn('COUNT', col('zone')), 'count']],
        group: ['zone'],
        order: [[fn('COUNT', col('zone')), 'DESC']],
        limit: 1,
        raw: true,
      })
      return { zone: grouped[0]?.zone || 'ZoneB' }
    }
    case 'SUPPLY_SHORTAGE': {
      if (payload.resourceId) return payload
      const preferred = await Resource.findOne({ order: [['available', 'DESC']] })
      return { resourceId: preferred?.id }
    }
    case 'NEW_INCIDENT':
      return payload
    default:
      return payload
  }
}
