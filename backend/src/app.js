import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import routes from './routes/index.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import { getAllowedOrigins } from './config/corsOrigins.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  })
)
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('/health', (req, res) => res.json({ status: 'ok', mode: 'SIMULATION' }))

app.use('/api', apiLimiter, routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
