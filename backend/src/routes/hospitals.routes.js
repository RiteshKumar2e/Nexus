import { Router } from 'express'
import { listHospitals, updateHospital } from '../controllers/hospitals.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listHospitals)
router.patch('/:id', requireRole('COMMANDER', 'OPERATOR'), updateHospital)

export default router
