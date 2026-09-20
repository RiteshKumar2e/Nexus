import { Router } from 'express'
import { listPlans, getPlan, approvePlan, rejectPlan } from '../controllers/plans.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listPlans)
router.get('/:id', getPlan)
router.post('/:id/approve', requireRole('COMMANDER', 'OPERATOR'), approvePlan)
router.post('/:id/reject', requireRole('COMMANDER', 'OPERATOR'), rejectPlan)

export default router
