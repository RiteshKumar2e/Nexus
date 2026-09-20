import { Router } from 'express'
import { listIncidents, getIncident, createIncident, updateIncident } from '../controllers/incidents.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listIncidents)
router.post('/', requireRole('COMMANDER', 'OPERATOR'), createIncident)
router.get('/:id', getIncident)
router.patch('/:id', requireRole('COMMANDER', 'OPERATOR'), updateIncident)

export default router
