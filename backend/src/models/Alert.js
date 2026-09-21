import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const Alert = sequelize.define(
  'Alert',
  {
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    severity: { type: DataTypes.ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'INFORMATION'), defaultValue: 'INFORMATION' },
    district: { type: DataTypes.STRING, allowNull: true },
    // VERIFIED: traceable to a public government source. SIMULATED: generated
    // by this app's response-simulation engine for demonstration purposes.
    sourceType: { type: DataTypes.ENUM('VERIFIED', 'SIMULATED'), defaultValue: 'SIMULATED' },
    source: { type: DataTypes.STRING, defaultValue: 'Response Simulation' },
    issuedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: 'alerts' }
)

withMongoCompatId(Alert)

export default Alert
