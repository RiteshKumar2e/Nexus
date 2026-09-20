import { Router } from 'express'
import authRoutes from './auth.routes.js'
import incidentsRoutes from './incidents.routes.js'
import teamsRoutes from './teams.routes.js'
import resourcesRoutes from './resources.routes.js'
import hospitalsRoutes from './hospitals.routes.js'
import sheltersRoutes from './shelters.routes.js'
import roadsRoutes from './roads.routes.js'
import plansRoutes from './plans.routes.js'
import simulationRoutes from './simulation.routes.js'
import aiRoutes from './ai.routes.js'
import decisionLogRoutes from './decisionLog.routes.js'
import dashboardRoutes from './dashboard.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/incidents', incidentsRoutes)
router.use('/teams', teamsRoutes)
router.use('/resources', resourcesRoutes)
router.use('/hospitals', hospitalsRoutes)
router.use('/shelters', sheltersRoutes)
router.use('/roads', roadsRoutes)
router.use('/plans', plansRoutes)
router.use('/simulation', simulationRoutes)
router.use('/ai', aiRoutes)
router.use('/decision-log', decisionLogRoutes)
router.use('/dashboard', dashboardRoutes)

export default router
