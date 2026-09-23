import { sequelize } from '../config/db.js'
import User from './User.js'
import Road from './Road.js'
import ResponseTeam from './ResponseTeam.js'
import Resource from './Resource.js'
import MedicalUnit from './MedicalUnit.js'
import ReliefCamp from './ReliefCamp.js'
import Incident from './Incident.js'
import District from './District.js'
import CommunityKitchen from './CommunityKitchen.js'
import Alert from './Alert.js'
import ResponsePlan from './ResponsePlan.js'
import PlanAction from './PlanAction.js'
import DecisionLog from './DecisionLog.js'
import SimulationEvent from './SimulationEvent.js'
import SimulationState from './SimulationState.js'
import ContactMessage from './ContactMessage.js'

Incident.belongsTo(ResponseTeam, { as: 'assignedTeam', foreignKey: 'assignedTeamId' })
ResponseTeam.hasMany(Incident, { foreignKey: 'assignedTeamId' })

ResponsePlan.belongsTo(Incident, { as: 'incident', foreignKey: 'incidentId' })
ResponsePlan.belongsTo(ResponsePlan, { as: 'previousPlan', foreignKey: 'previousPlanId' })
ResponsePlan.belongsTo(User, { as: 'approvedBy', foreignKey: 'approvedById' })

ResponsePlan.hasMany(PlanAction, { as: 'actions', foreignKey: 'planId', onDelete: 'CASCADE' })
PlanAction.belongsTo(ResponsePlan, { foreignKey: 'planId' })
PlanAction.belongsTo(ResponseTeam, { as: 'team', foreignKey: 'teamId' })
PlanAction.belongsTo(Resource, { as: 'resource', foreignKey: 'resourceId' })
PlanAction.belongsTo(MedicalUnit, { as: 'medicalUnit', foreignKey: 'medicalUnitId' })
PlanAction.belongsTo(ReliefCamp, { as: 'reliefCamp', foreignKey: 'reliefCampId' })

DecisionLog.belongsTo(ResponsePlan, { as: 'relatedPlan', foreignKey: 'relatedPlanId' })

export async function syncModels(options = {}) {
  await sequelize.sync(options)
}

export {
  sequelize,
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
  ContactMessage,
}
