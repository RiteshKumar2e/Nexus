// Attaches a Mongo-style `_id` alias (stringified primary key) to every model's
// JSON output, so the existing frontend (built expecting `_id`) needs no changes
// after the move from MongoDB/Mongoose to SQLite/Sequelize.
export function withMongoCompatId(Model) {
  Model.prototype.toJSON = function toJSON() {
    const values = { ...this.get() }
    if (values.id !== undefined) values._id = String(values.id)
    return values
  }
  return Model
}
