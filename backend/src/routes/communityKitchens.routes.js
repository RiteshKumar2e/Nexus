import { Router } from 'express'
import { listCommunityKitchens, updateCommunityKitchen } from '../controllers/communityKitchens.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listCommunityKitchens)
router.patch('/:id', requireRole('COMMANDER', 'OPERATOR'), updateCommunityKitchen)

export default router
