import expressAsyncHandler from 'express-async-handler'
import { Op } from 'sequelize'
import Incident from '../models/Incident.js'
import ResponseTeam from '../models/ResponseTeam.js'
import Hospital from '../models/Hospital.js'
import Shelter from '../models/Shelter.js'
import Resource from '../models/Resource.js'
import ResponsePlan from '../models/ResponsePlan.js'
import SimulationState from '../models/SimulationState.js'

export const getSummary = expressAsyncHandler(async (req, res) => {
  const [
    activeIncidents,
    criticalIncidents,
    teamsTotal,
    teamsActive,
    hospitalsTotal,
    hospitalsHealthy,
    shelters,
    resources,
    activePlan,
    simState,
  ] = await Promise.all([
    Incident.count({ where: { status: { [Op.ne]: 'RESOLVED' } } }),
    Incident.count({ where: { severity: 'CRITICAL', status: { [Op.ne]: 'RESOLVED' } } }),
    ResponseTeam.count(),
    ResponseTeam.count({ where: { status: { [Op.in]: ['BUSY', 'EN_ROUTE'] } } }),
    Hospital.count(),
    Hospital.count({ where: { status: 'NORMAL' } }),
    Shelter.findAll(),
    Resource.findAll(),
    ResponsePlan.findOne({
      where: { status: 'ACTIVE' },
      order: [['createdAt', 'DESC']],
      include: [{ association: 'incident' }, { association: 'actions', include: ['team', 'hospital', 'shelter'] }],
    }),
    SimulationState.findOne(),
  ])

  const shelterCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0)
  const shelterOccupied = shelters.reduce((sum, s) => sum + s.occupied, 0)
  const resourcesCritical = resources.some((r) => r.status === 'CRITICAL')
  const resourcesLow = resources.some((r) => r.status === 'LOW')

  res.json({
    activeIncidents,
    criticalIncidents,
    teamsTotal,
    teamsActive,
    hospitalsTotal,
    hospitalsHealthy,
    shelterCapacityPct: shelterCapacity ? Math.round((shelterOccupied / shelterCapacity) * 100) : 0,
    resourceStatus: resourcesCritical ? 'CRITICAL' : resourcesLow ? 'LOW' : 'HEALTHY',
    activePlan,
    simulation: simState,
  })
})
