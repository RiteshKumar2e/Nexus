import { Router } from 'express'
import { listMedicalUnits, updateMedicalUnit } from '../controllers/medicalUnits.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listMedicalUnits)
router.patch('/:id', requireRole('COMMANDER', 'OPERATOR'), updateMedicalUnit)

export default router
