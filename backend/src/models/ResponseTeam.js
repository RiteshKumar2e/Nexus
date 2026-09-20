import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

// currentAssignment mirrors the old Mongoose embedded object:
// { zone, incidentId, route: [nodeIds], roadsUsed: [roadIds], eta }
// Stored as a single JSON column — always REASSIGN the whole object when
// changing it (don't mutate nested keys) so Sequelize detects the change.
const ResponseTeam = sequelize.define(
  'ResponseTeam',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('RESCUE', 'MEDICAL', 'FIRE', 'WATER', 'EVACUATION'), allowNull: false },
    status: { type: DataTypes.ENUM('AVAILABLE', 'BUSY', 'EN_ROUTE', 'UNAVAILABLE'), defaultValue: 'AVAILABLE' },
    location: { type: DataTypes.STRING, allowNull: false },
    currentAssignment: {
      type: DataTypes.JSON,
      defaultValue: { zone: null, incidentId: null, route: [], roadsUsed: [], eta: null },
    },
    resources: { type: DataTypes.JSON, defaultValue: [] },
    membersCount: { type: DataTypes.INTEGER, defaultValue: 6 },
  },
  { tableName: 'response_teams' }
)

withMongoCompatId(ResponseTeam)

export default ResponseTeam
