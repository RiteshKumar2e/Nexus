import { Router } from 'express'
import { listShelters, updateShelter } from '../controllers/shelters.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listShelters)
router.patch('/:id', requireRole('COMMANDER', 'OPERATOR'), updateShelter)

export default router
