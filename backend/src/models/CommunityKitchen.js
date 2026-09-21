import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const CommunityKitchen = sequelize.define(
  'CommunityKitchen',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('ACTIVE', 'SETTING_UP', 'SUSPENDED'), defaultValue: 'ACTIVE' },
    foodSupplyStatus: { type: DataTypes.ENUM('AVAILABLE', 'LIMITED', 'CRITICAL_SHORTAGE'), defaultValue: 'AVAILABLE' },
    distributionStatus: { type: DataTypes.ENUM('ONGOING', 'SCHEDULED', 'PAUSED'), defaultValue: 'ONGOING' },
    priority: { type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'), defaultValue: 'MEDIUM' },
  },
  { tableName: 'community_kitchens' }
)

withMongoCompatId(CommunityKitchen)

export default CommunityKitchen
