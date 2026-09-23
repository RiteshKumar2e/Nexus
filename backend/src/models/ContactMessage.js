import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

export const INQUIRY_TYPES = ['DEMO_REQUEST', 'PARTNERSHIP', 'EMERGENCY_COORDINATION', 'VOLUNTEER', 'OTHER']

const ContactMessage = sequelize.define(
  'ContactMessage',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    organization: { type: DataTypes.STRING, allowNull: true },
    district: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    inquiryType: { type: DataTypes.ENUM(...INQUIRY_TYPES), defaultValue: 'OTHER' },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('NEW', 'READ', 'RESOLVED'), defaultValue: 'NEW' },
  },
  { tableName: 'contact_messages' }
)

withMongoCompatId(ContactMessage)

export default ContactMessage
