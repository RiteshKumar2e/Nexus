import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const Incident = sequelize.define(
  'Incident',
  {
    incidentId: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: {
      type: DataTypes.ENUM('FLOOD', 'BUILDING_COLLAPSE', 'FIRE', 'MEDICAL_EMERGENCY', 'ROAD_ACCIDENT', 'WATER_RESCUE', 'INFRASTRUCTURE'),
      allowNull: false,
    },
    severity: { type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'), defaultValue: 'MEDIUM' },
    status: { type: DataTypes.ENUM('ACTIVE', 'MONITORING', 'RESOLVED'), defaultValue: 'ACTIVE' },
    zone: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    affectedPopulation: { type: DataTypes.INTEGER, defaultValue: 0 },
    requiredResources: { type: DataTypes.JSON, defaultValue: [] },
    evidence: { type: DataTypes.JSON, defaultValue: [] },
    aiAssessment: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'incidents',
    indexes: [{ fields: ['severity'] }, { fields: ['status'] }, { fields: ['createdAt'] }],
  }
)

withMongoCompatId(Incident)

export default Incident
