import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const Road = sequelize.define(
  'Road',
  {
    roadId: { type: DataTypes.STRING, allowNull: false, unique: true },
    from: { type: DataTypes.STRING, allowNull: false },
    to: { type: DataTypes.STRING, allowNull: false },
    distanceKm: { type: DataTypes.FLOAT, allowNull: false },
    travelTimeMin: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('OPEN', 'CONGESTED', 'BLOCKED', 'DANGEROUS'), defaultValue: 'OPEN' },
    risk: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  { tableName: 'roads' }
)

withMongoCompatId(Road)

export default Road
