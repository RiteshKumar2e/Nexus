import 'dotenv/config'
import http from 'http'
import app from './app.js'
import { connectDB } from './config/db.js'
import { syncModels } from './models/associations.js'
import { initSocket } from './socket/index.js'

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  await syncModels()

  const server = http.createServer(app)
  initSocket(server)

  server.listen(PORT, () => {
    console.log(`[nexus] server listening on port ${PORT} — SIMULATION MODE`)
  })
}

start().catch((err) => {
  console.error('[nexus] failed to start:', err)
  process.exit(1)
})
