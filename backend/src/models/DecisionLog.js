import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const DecisionLog = sequelize.define(
  'DecisionLog',
  {
    decisionNumber: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    trigger: { type: DataTypes.TEXT, allowNull: false },
    agents: { type: DataTypes.JSON, defaultValue: [] },
    decision: { type: DataTypes.TEXT, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    result: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('EXECUTED', 'PENDING', 'REJECTED'), defaultValue: 'EXECUTED' },
    aiExplanation: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'decision_logs',
    indexes: [{ fields: ['createdAt'] }],
  }
)

withMongoCompatId(DecisionLog)

export default DecisionLog
