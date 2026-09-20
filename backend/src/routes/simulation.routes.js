import { Router } from 'express'
import {
  getState,
  startSimulation,
  pauseSimulation,
  resumeSimulation,
  resetSimulation,
  triggerEvent,
} from '../controllers/simulation.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/state', getState)
router.post('/start', requireRole('COMMANDER', 'OPERATOR'), startSimulation)
router.post('/pause', requireRole('COMMANDER', 'OPERATOR'), pauseSimulation)
router.post('/resume', requireRole('COMMANDER', 'OPERATOR'), resumeSimulation)
router.post('/reset', requireRole('COMMANDER', 'OPERATOR'), resetSimulation)
router.post('/event', requireRole('COMMANDER', 'OPERATOR'), triggerEvent)

export default router
