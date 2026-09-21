import { Sequelize } from 'sequelize'
import libsqlSqlite3 from './libsqlSequelizeDriver.js'

const tursoUrl = process.env.TURSO_DATABASE_URL
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN

if (!tursoUrl) {
  throw new Error(
    '[db] TURSO_DATABASE_URL is not set. This app always runs against Turso — set TURSO_DATABASE_URL (and TURSO_AUTH_TOKEN) in backend/.env, both locally and on every deployment.'
  )
}

const storage = tursoAuthToken
  ? `${tursoUrl}${tursoUrl.includes('?') ? '&' : '?'}authToken=${tursoAuthToken}`
  : tursoUrl

export const sequelize = new Sequelize({
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

export async function connectDB() {
  await sequelize.authenticate()
  console.log(`[db] connected: turso (${tursoUrl})`)
}
