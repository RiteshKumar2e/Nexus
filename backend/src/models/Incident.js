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
    district: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    // Qualitative scale instead of an invented precise headcount — this is a
    // simulated incident, not a verified casualty/affected-population report.
    populationImpact: { type: DataTypes.ENUM('LOCALIZED', 'MODERATE', 'LARGE', 'SEVERE'), defaultValue: 'MODERATE' },
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
