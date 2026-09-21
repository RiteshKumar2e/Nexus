import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

// One row per Bihar flood-response district. `id` matches the node id in
// config/zones.js so incidents/teams/medical units/relief camps can all
// reference the same district code.
const District = sequelize.define(
  'District',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    river: { type: DataTypes.STRING, allowNull: false },
    riskLevel: { type: DataTypes.ENUM('CRITICAL', 'HIGH', 'MONITORING'), defaultValue: 'MONITORING' },
    status: {
      type: DataTypes.ENUM('EVACUATION_REQUIRED', 'ACTIVE_RESPONSE', 'RELIEF_OPERATIONS', 'MONITORING'),
      defaultValue: 'MONITORING',
    },
    responseType: { type: DataTypes.STRING, allowNull: false },
    affectedArea: { type: DataTypes.STRING, allowNull: false },
    priorityNeeds: { type: DataTypes.JSON, defaultValue: [] },
  },
  { tableName: 'districts', timestamps: true }
)

withMongoCompatId(District)

export default District
