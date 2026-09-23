import { Router } from 'express'
import authRoutes from './auth.routes.js'
import incidentsRoutes from './incidents.routes.js'
import teamsRoutes from './teams.routes.js'
import resourcesRoutes from './resources.routes.js'
import medicalUnitsRoutes from './medicalUnits.routes.js'
import reliefCampsRoutes from './reliefCamps.routes.js'
import communityKitchensRoutes from './communityKitchens.routes.js'
import districtsRoutes from './districts.routes.js'
import alertsRoutes from './alerts.routes.js'
import roadsRoutes from './roads.routes.js'
import plansRoutes from './plans.routes.js'
import simulationRoutes from './simulation.routes.js'
import aiRoutes from './ai.routes.js'
import decisionLogRoutes from './decisionLog.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import contactRoutes from './contact.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/incidents', incidentsRoutes)
router.use('/teams', teamsRoutes)
router.use('/resources', resourcesRoutes)
router.use('/medical', medicalUnitsRoutes)
router.use('/relief-camps', reliefCampsRoutes)
router.use('/community-kitchens', communityKitchensRoutes)
router.use('/districts', districtsRoutes)
router.use('/alerts', alertsRoutes)
router.use('/roads', roadsRoutes)
router.use('/plans', plansRoutes)
router.use('/simulation', simulationRoutes)
router.use('/ai', aiRoutes)
router.use('/decision-log', decisionLogRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/contact', contactRoutes)

export default router
