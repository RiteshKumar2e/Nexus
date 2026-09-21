import LibsqlSqlite3 from '@libsql/sqlite3'

// @libsql/sqlite3 returns row objects built from hrana-client's rowFromProto(),
// which defines each named column with `Object.defineProperty(row, name, { value,
// enumerable: true })` — enumerable, but NOT writable (that's the property
// descriptor default). Sequelize's own sqlite dialect code mutates result rows
// in place in a few places (e.g. `item.unique = !!item.unique` in
// handleShowIndexesQuery, run during sync/index inspection), which throws
// "Cannot assign to read only property" against those rows. Spreading each row
// into a plain object (a normal write of its current values) sidesteps this —
// the values are all read via their getters/data descriptors either way, and a
// fresh plain object has ordinary writable properties.
function plainRow(row) {
  return row == null ? row : { ...row }
}

class Database extends LibsqlSqlite3.Database {
  all(sql, ...args) {
    const i = args.length - 1
    if (typeof args[i] === 'function') {
      const cb = args[i]
      args[i] = (err, rows) => cb(err, Array.isArray(rows) ? rows.map(plainRow) : rows)
    }
    return super.all(sql, ...args)
  }

  get(sql, ...args) {
    const i = args.length - 1
    if (typeof args[i] === 'function') {
      const cb = args[i]
      args[i] = (err, row) => cb(err, plainRow(row))
    }
    return super.get(sql, ...args)
  }

  each(sql, ...args) {
    // sqlite3's each() signature is (sql, [params,] rowCallback[, completeCallback]).
    // Mirror @libsql/sqlite3's own detection of which trailing arg is the row callback.
    const n = args.length
    if (n >= 2 && typeof args[n - 1] === 'function' && typeof args[n - 2] === 'function') {
      const cb = args[n - 2]
      args[n - 2] = (err, row) => cb(err, plainRow(row))
    } else if (n >= 1 && typeof args[n - 1] === 'function') {
      const cb = args[n - 1]
      args[n - 1] = (err, row) => cb(err, plainRow(row))
    }
    return super.each(sql, ...args)
  }
}

export default { ...LibsqlSqlite3, Database }
