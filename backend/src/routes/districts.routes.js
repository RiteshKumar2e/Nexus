import { Router } from 'express'
import { listDistricts, getDistrict } from '../controllers/districts.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listDistricts)
router.get('/:id', getDistrict)

export default router
