import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const Hospital = sequelize.define(
  'Hospital',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    totalBeds: { type: DataTypes.INTEGER, allowNull: false },
    availableBeds: { type: DataTypes.INTEGER, allowNull: false },
    icuBeds: { type: DataTypes.INTEGER, allowNull: false },
    icuAvailable: { type: DataTypes.INTEGER, allowNull: false },
    emergencyCapacity: { type: DataTypes.INTEGER, allowNull: false },
    currentLoadPct: { type: DataTypes.INTEGER, defaultValue: 40 },
    status: { type: DataTypes.ENUM('NORMAL', 'WARNING', 'CRITICAL'), defaultValue: 'NORMAL' },
    ambulanceEtaMin: { type: DataTypes.INTEGER, defaultValue: 10 },
  },
  { tableName: 'hospitals' }
)

withMongoCompatId(Hospital)

export default Hospital
