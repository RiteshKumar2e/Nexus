import { Router } from 'express'
import { listReliefCamps, updateReliefCamp } from '../controllers/reliefCamps.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listReliefCamps)
router.patch('/:id', requireRole('COMMANDER', 'OPERATOR'), updateReliefCamp)

export default router
