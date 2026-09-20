import { Router } from 'express'
import { listTeams, getTeam, updateTeam } from '../controllers/teams.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', listTeams)
router.get('/:id', getTeam)
router.patch('/:id', requireRole('COMMANDER', 'OPERATOR'), updateTeam)

export default router
