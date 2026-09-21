import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const SimulationState = sequelize.define(
  'SimulationState',
  {
    scenario: { type: DataTypes.STRING, defaultValue: 'BIHAR FLOOD RESPONSE 2026' },
    status: { type: DataTypes.ENUM('IDLE', 'RUNNING', 'PAUSED'), defaultValue: 'IDLE' },
    startedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'simulation_states' }
)

withMongoCompatId(SimulationState)

export default SimulationState
