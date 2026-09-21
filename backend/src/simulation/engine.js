import { Op, fn, col } from 'sequelize'
import Road from '../models/Road.js'
import MedicalUnit from '../models/MedicalUnit.js'
import ReliefCamp from '../models/ReliefCamp.js'
import ResponseTeam from '../models/ResponseTeam.js'
import Resource from '../models/Resource.js'
import Incident from '../models/Incident.js'

const CAMP_STATUS_RANK = { AVAILABLE: 0, NEAR_CAPACITY: 1, FULL: 2 }

/**
 * Resolves a sensible default target for a simulation event button when the
 * operator doesn't pick a specific entity — e.g. "Trigger Road Block" always
 * blocks the primary walkthrough road, defaulting to R8 to match the primary
 * demo narrative (Road R8 blocked → SDRF Team 1 rerouted toward Bhagalpur).
 */
export async function resolveEventPayload(type, payload = {}) {
  switch (type) {
    case 'ROAD_BLOCKED': {
      if (payload.roadId) return payload
      const preferred = await Road.findOne({ where: { roadId: 'R8', status: { [Op.ne]: 'BLOCKED' } } })
      if (preferred) return { roadId: preferred.roadId }
      const fallback = await Road.findOne({ where: { status: { [Op.ne]: 'BLOCKED' } } })
      return { roadId: fallback?.roadId }
    }
    case 'HOSPITAL_OVERLOAD': {
      if (payload.hospitalId) return payload
      const preferred = await MedicalUnit.findOne({ where: { name: { [Op.like]: '%Naugachia%' }, status: { [Op.ne]: 'CRITICAL' } } })
      if (preferred) return { hospitalId: preferred.id }
      const fallback = await MedicalUnit.findOne({ where: { status: { [Op.ne]: 'CRITICAL' } } })
      return { hospitalId: fallback?.id }
    }
    case 'SHELTER_FULL': {
      if (payload.shelterId) return payload
      const preferred = await ReliefCamp.findOne({ where: { name: { [Op.like]: '%Bhagalpur%' }, capacityStatus: { [Op.ne]: 'FULL' } } })
      if (preferred) return { shelterId: preferred.id }
      const camps = await ReliefCamp.findAll({ where: { capacityStatus: { [Op.ne]: 'FULL' } } })
      const best = camps.sort((a, b) => (CAMP_STATUS_RANK[b.capacityStatus] ?? 0) - (CAMP_STATUS_RANK[a.capacityStatus] ?? 0))[0]
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
        attributes: ['district', [fn('COUNT', col('district')), 'count']],
        group: ['district'],
        order: [[fn('COUNT', col('district')), 'DESC']],
        limit: 1,
        raw: true,
      })
      return { zone: grouped[0]?.district || 'BHAGALPUR' }
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
