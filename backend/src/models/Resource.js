import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const Resource = sequelize.define(
  'Resource',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    category: {
      type: DataTypes.ENUM('AMBULANCE', 'BOAT', 'MEDICAL_KIT', 'WATER', 'FOOD', 'FUEL', 'EQUIPMENT', 'LIFE_JACKET'),
      allowNull: false,
    },
    unit: { type: DataTypes.STRING, defaultValue: 'units' },
    // District this pool is currently concentrated/deployed in (nullable —
    // some categories, like fuel reserves, are held centrally at BASE).
    region: { type: DataTypes.STRING, allowNull: true },
    purpose: { type: DataTypes.STRING, allowNull: true },
    // Kept for internal simulation bookkeeping (supply-shortage math, the
    // Analytics resource chart) — the UI leads with `status`, not these numbers.
    total: { type: DataTypes.INTEGER, allowNull: false },
    available: { type: DataTypes.INTEGER, allowNull: false },
    allocated: { type: DataTypes.INTEGER, defaultValue: 0 },
    consumed: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'DEPLOYED', 'STANDBY', 'MAINTENANCE', 'CRITICAL_SHORTAGE'),
      defaultValue: 'AVAILABLE',
    },
  },
  { tableName: 'resources' }
)

withMongoCompatId(Resource)

export default Resource
