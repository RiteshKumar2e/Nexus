import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import { sequelize } from '../config/db.js'
import { withMongoCompatId } from './_compat.js'

const User = sequelize.define(
  'User',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('COMMANDER', 'OPERATOR', 'VIEWER'), defaultValue: 'OPERATOR' },
  },
  {
    tableName: 'users',
    defaultScope: { attributes: { exclude: ['password'] } },
  }
)

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
})

User.prototype.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

User.prototype.toSafeObject = function () {
  return { id: this.id, name: this.name, email: this.email, role: this.role }
}

withMongoCompatId(User)

export default User
