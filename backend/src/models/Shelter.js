import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const Shelter = sequelize.define(
  'Shelter',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    occupied: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('AVAILABLE', 'NEAR_CAPACITY', 'FULL'), defaultValue: 'AVAILABLE' },
  },
  { tableName: 'shelters' }
)

withMongoCompatId(Shelter)

export default Shelter
