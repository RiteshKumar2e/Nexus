import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const Resource = sequelize.define(
  'Resource',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    category: {
      type: DataTypes.ENUM('AMBULANCE', 'BOAT', 'MEDICAL_KIT', 'WATER', 'FOOD', 'FUEL', 'EQUIPMENT'),
      allowNull: false,
    },
    unit: { type: DataTypes.STRING, defaultValue: 'units' },
    total: { type: DataTypes.INTEGER, allowNull: false },
    available: { type: DataTypes.INTEGER, allowNull: false },
    allocated: { type: DataTypes.INTEGER, defaultValue: 0 },
    consumed: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('HEALTHY', 'LOW', 'CRITICAL'), defaultValue: 'HEALTHY' },
  },
  { tableName: 'resources' }
)

withMongoCompatId(Resource)

export default Resource
