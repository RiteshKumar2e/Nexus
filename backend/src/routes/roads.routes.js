import { Router } from 'express'
import { listRoads, updateRoad } from '../controllers/roads.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listRoads)
router.patch('/:id', requireRole('COMMANDER', 'OPERATOR'), updateRoad)

export default router
