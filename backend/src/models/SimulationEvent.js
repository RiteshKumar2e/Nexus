import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const SimulationEvent = sequelize.define(
  'SimulationEvent',
  {
    type: { type: DataTypes.STRING, allowNull: false },
    payload: { type: DataTypes.JSON, defaultValue: {} },
    description: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: 'simulation_events' }
)

withMongoCompatId(SimulationEvent)

export default SimulationEvent
