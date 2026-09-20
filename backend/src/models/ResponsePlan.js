import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const ResponsePlan = sequelize.define(
  'ResponsePlan',
  {
    planNumber: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    status: { type: DataTypes.ENUM('PROPOSED', 'ACTIVE', 'INVALIDATED', 'EXECUTED', 'REJECTED'), defaultValue: 'PROPOSED' },
    trigger: { type: DataTypes.TEXT, allowNull: false },
    affectedResources: { type: DataTypes.JSON, defaultValue: [] },
    estimatedImpact: { type: DataTypes.STRING, allowNull: true },
    reasoning: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: 'response_plans' }
)

withMongoCompatId(ResponsePlan)

export default ResponsePlan
