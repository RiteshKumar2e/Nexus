import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const SimulationState = sequelize.define(
  'SimulationState',
  {
    scenario: { type: DataTypes.STRING, defaultValue: 'PATNA FLOOD RESPONSE' },
    status: { type: DataTypes.ENUM('IDLE', 'RUNNING', 'PAUSED'), defaultValue: 'IDLE' },
    populationAffected: { type: DataTypes.INTEGER, defaultValue: 24800 },
    startedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'simulation_states' }
)

withMongoCompatId(SimulationState)

export default SimulationState
