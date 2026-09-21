import expressAsyncHandler from 'express-async-handler'
import { Op } from 'sequelize'
import Incident from '../models/Incident.js'
import ResponseTeam from '../models/ResponseTeam.js'
import MedicalUnit from '../models/MedicalUnit.js'
import ReliefCamp from '../models/ReliefCamp.js'
import Resource from '../models/Resource.js'
import District from '../models/District.js'
import CommunityKitchen from '../models/CommunityKitchen.js'
import Alert from '../models/Alert.js'
import ResponsePlan from '../models/ResponsePlan.js'
import SimulationState from '../models/SimulationState.js'

const WORST = (statuses, order) => order.find((s) => statuses.includes(s)) || order[order.length - 1]

export const getSummary = expressAsyncHandler(async (req, res) => {
  const [
    activeIncidents,
    criticalIncidents,
    teamsTotal,
    teamsActive,
    districts,
    medicalUnits,
    reliefCamps,
    resources,
    kitchensActive,
    kitchensTotal,
    criticalAlerts,
    activePlan,
    simState,
  ] = await Promise.all([
    Incident.count({ where: { status: { [Op.ne]: 'RESOLVED' } } }),
    Incident.count({ where: { severity: 'CRITICAL', status: { [Op.ne]: 'RESOLVED' } } }),
    ResponseTeam.count(),
    ResponseTeam.count({ where: { status: { [Op.in]: ['BUSY', 'EN_ROUTE'] } } }),
    District.findAll(),
    MedicalUnit.findAll(),
    ReliefCamp.findAll(),
    Resource.findAll(),
    CommunityKitchen.count({ where: { status: 'ACTIVE' } }),
    CommunityKitchen.count(),
    Alert.count({ where: { severity: 'CRITICAL' } }),
    ResponsePlan.findOne({
      where: { status: 'ACTIVE' },
      order: [['createdAt', 'DESC']],
      include: [{ association: 'incident' }, { association: 'actions', include: ['team', 'medicalUnit', 'reliefCamp'] }],
    }),
    SimulationState.findOne(),
  ])

  const criticalDistricts = districts.filter((d) => d.riskLevel === 'CRITICAL').length
  const activeReliefCamps = reliefCamps.filter((c) => c.status === 'ACTIVE').length
  const fullReliefCamps = reliefCamps.filter((c) => c.capacityStatus === 'FULL').length

  const medicalStatus = WORST(medicalUnits.map((m) => m.status), ['CRITICAL', 'HIGH_DEMAND', 'LIMITED', 'AVAILABLE'])
  const resourceStatus = WORST(resources.map((r) => r.status), ['CRITICAL_SHORTAGE', 'MAINTENANCE', 'STANDBY', 'DEPLOYED', 'AVAILABLE'])

  res.json({
    affectedDistricts: districts.length,
    criticalDistricts,
    activeIncidents,
    criticalIncidents,
    teamsTotal,
    teamsActive,
    medicalUnitsTotal: medicalUnits.length,
    medicalStatus,
    reliefCampsTotal: reliefCamps.length,
    activeReliefCamps,
    fullReliefCamps,
    resourceStatus,
    kitchensActive,
    kitchensTotal,
    criticalAlerts,
    activePlan,
    simulation: simState,
  })
})
