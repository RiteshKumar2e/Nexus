import { Router } from 'express'
import { listResources, updateResource } from '../controllers/resources.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listResources)
router.patch('/:id', requireRole('COMMANDER', 'OPERATOR'), updateResource)

export default router
