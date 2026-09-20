import { sequelize } from '../config/db.js'
import User from './User.js'
import Road from './Road.js'
import ResponseTeam from './ResponseTeam.js'
import Resource from './Resource.js'
import Hospital from './Hospital.js'
import Shelter from './Shelter.js'
import Incident from './Incident.js'
import ResponsePlan from './ResponsePlan.js'
import PlanAction from './PlanAction.js'
import DecisionLog from './DecisionLog.js'
import SimulationEvent from './SimulationEvent.js'
import SimulationState from './SimulationState.js'

Incident.belongsTo(ResponseTeam, { as: 'assignedTeam', foreignKey: 'assignedTeamId' })
ResponseTeam.hasMany(Incident, { foreignKey: 'assignedTeamId' })

ResponsePlan.belongsTo(Incident, { as: 'incident', foreignKey: 'incidentId' })
ResponsePlan.belongsTo(ResponsePlan, { as: 'previousPlan', foreignKey: 'previousPlanId' })
ResponsePlan.belongsTo(User, { as: 'approvedBy', foreignKey: 'approvedById' })

ResponsePlan.hasMany(PlanAction, { as: 'actions', foreignKey: 'planId', onDelete: 'CASCADE' })
PlanAction.belongsTo(ResponsePlan, { foreignKey: 'planId' })
PlanAction.belongsTo(ResponseTeam, { as: 'team', foreignKey: 'teamId' })
PlanAction.belongsTo(Resource, { as: 'resource', foreignKey: 'resourceId' })
PlanAction.belongsTo(Hospital, { as: 'hospital', foreignKey: 'hospitalId' })
PlanAction.belongsTo(Shelter, { as: 'shelter', foreignKey: 'shelterId' })

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
  Hospital,
  Shelter,
  Incident,
  ResponsePlan,
  PlanAction,
  DecisionLog,
  SimulationEvent,
  SimulationState,
}
