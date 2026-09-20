import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

// Replaces the embedded `actions[]` array from the old ResponsePlan Mongoose
// schema — each action is now its own row, linked to its ResponsePlan by FK.
const PlanAction = sequelize.define(
  'PlanAction',
  {
    type: { type: DataTypes.ENUM('TEAM_DISPATCH', 'AMBULANCE_TRANSPORT', 'EVACUATION', 'SUPPLY_DELIVERY'), allowNull: false },
    fromNode: { type: DataTypes.STRING, allowNull: true },
    toNode: { type: DataTypes.STRING, allowNull: true },
    route: { type: DataTypes.JSON, defaultValue: [] },
    roadsUsed: { type: DataTypes.JSON, defaultValue: [] },
    etaMin: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: 'plan_actions' }
)

withMongoCompatId(PlanAction)

export default PlanAction
