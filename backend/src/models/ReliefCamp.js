import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const ReliefCamp = sequelize.define(
  'ReliefCamp',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    capacityStatus: { type: DataTypes.ENUM('AVAILABLE', 'NEAR_CAPACITY', 'FULL'), defaultValue: 'AVAILABLE' },
    // Subset of: FOOD, DRINKING_WATER, MEDICAL_ASSISTANCE, TEMPORARY_SHELTER
    facilities: { type: DataTypes.JSON, defaultValue: [] },
    accessibility: { type: DataTypes.ENUM('ACCESSIBLE', 'PARTIALLY_ACCESSIBLE', 'DIFFICULT'), defaultValue: 'ACCESSIBLE' },
    status: { type: DataTypes.ENUM('ACTIVE', 'SETTING_UP', 'CLOSED'), defaultValue: 'ACTIVE' },
  },
  { tableName: 'relief_camps' }
)

withMongoCompatId(ReliefCamp)

export default ReliefCamp
