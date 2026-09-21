import { Sequelize } from 'sequelize'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import libsqlSqlite3 from './libsqlSequelizeDriver.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const tursoUrl = process.env.TURSO_DATABASE_URL

let sequelize
let describeStorage

if (tursoUrl) {
  // Turso (libSQL) — same driver/URL for local dev and every deployment once
  // TURSO_DATABASE_URL is set, so there's no local sqlite file to manage or
  // ship a persistent disk for.
  const authToken = process.env.TURSO_AUTH_TOKEN
  const storage = authToken
    ? `${tursoUrl}${tursoUrl.includes('?') ? '&' : '?'}authToken=${authToken}`
    : tursoUrl

  sequelize = new Sequelize({
    dialect: 'sqlite',
    dialectModule: libsqlSqlite3,
    storage,
    // Sequelize's sqlite connection manager runs `fs.mkdirSync(path.dirname(storage))`
    // whenever the open mode includes OPEN_CREATE — meaningless (and on Windows,
    // fatal: colons in "libsql://..." aren't valid path characters) for a remote
    // libsql:// URL. @libsql/sqlite3 ignores open-mode flags for remote connections
    // anyway (see its README), so omitting OPEN_CREATE here is safe and just skips
    // that local-file-only code path.
    dialectOptions: { mode: libsqlSqlite3.OPEN_READWRITE },
    logging: false,
  })
  describeStorage = `turso: ${tursoUrl}`
} else {
  const dataDir = path.join(__dirname, '..', '..', 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

  const storagePath = process.env.SQLITE_PATH
    ? path.resolve(process.cwd(), process.env.SQLITE_PATH)
    : path.join(dataDir, 'nexus.sqlite')

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  })
  describeStorage = `sqlite: ${storagePath}`
}

export { sequelize }

export async function connectDB() {
  await sequelize.authenticate()
  console.log(`[db] connected: ${describeStorage}`)
}
