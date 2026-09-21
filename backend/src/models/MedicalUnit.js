import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const STATUS_VALUES = ['AVAILABLE', 'LIMITED', 'HIGH_DEMAND', 'CRITICAL']

const MedicalUnit = sequelize.define(
  'MedicalUnit',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    facilityType: { type: DataTypes.ENUM('HOSPITAL', 'MEDICAL_CAMP', 'AMBULANCE_POST'), defaultValue: 'HOSPITAL' },
    doctorsStatus: { type: DataTypes.ENUM(...STATUS_VALUES), defaultValue: 'AVAILABLE' },
    ambulanceStatus: { type: DataTypes.ENUM(...STATUS_VALUES), defaultValue: 'AVAILABLE' },
    medicineStatus: { type: DataTypes.ENUM(...STATUS_VALUES), defaultValue: 'AVAILABLE' },
    priorityCases: { type: DataTypes.ENUM('LOW', 'MODERATE', 'HIGH', 'CRITICAL'), defaultValue: 'LOW' },
    accessibility: { type: DataTypes.ENUM('ACCESSIBLE', 'PARTIALLY_ACCESSIBLE', 'DIFFICULT'), defaultValue: 'ACCESSIBLE' },
    // Overall operational status — drives the status badge and map marker color.
    status: { type: DataTypes.ENUM(...STATUS_VALUES), defaultValue: 'AVAILABLE' },
  },
  { tableName: 'medical_units' }
)

withMongoCompatId(MedicalUnit)

export default MedicalUnit
